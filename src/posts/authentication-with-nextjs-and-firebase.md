---
title: '在Next.js專案中，使用Firebase實作身份驗證'
author: 江森
description: '如何在Next.js專案中使用Firebase實作身份驗證'
pubDate: 2025-07-07
image:
      url: '/nextjs-firebase-auth.png'
      alt: 'cover picture'
tags: ["Next.js"]
draft: false
---
## 前言

在之前[淺談身份驗證與身份授權](https://johnson-dev.netlify.app/posts/authentication-and-authorization/)一文當中，筆者簡短介紹了驗證與授權的概念。

剛好最近在弄的一個專案，讓我想來分享一下關於身份驗證的實作，這個專案是使用Next.js搭配Firebase。

什麼是Next.js？

Next.js是一個基於React的Web框架，它以React為基礎，整合了路由系統、服務端渲染（Server-Side Rendering）、靜態頁面生成（Static Site Generation）等開箱即用的開發工具，而且除了前端的UI建置外，Next.js甚至還能實作後端邏輯等，可以說是React的完全體，也是棲息在React生態系？的前端開發者必定會接觸到框架（應該吧？）。

雖說是React的完全體，但也不表示Next.js能夠全然取代React。

Next.js的好處是工具齊全、開箱即用，壞處是對規模沒那麼大，也不複雜的專案來說，它顯得太過笨重，就好像我只是想泡個泡麵解饞，卻用上五星級飯店的廚房設備來煮一碗泡麵那種感覺。

對有些喜歡自己的客製開發者來說，這類工具雖然大而全，卻必須配合工具專屬的規則、語法，反而會感覺綁手綁腳、缺乏彈性。

所以需不需要用上Next.js，還是得看開發者的本身或是專案的狀況而定。

![nextjs-meme](/nextjs-meme.png)

但身為棲息在React生態系？的前端開發者，考慮到專案未來的擴展性，以及我這次的專案也有點小複雜，所以就想用Next.js來實作看看。

什麼是Firebase？Firebase是Google旗下的子公司，提供BaaS(Backend as a Service)也就後端即服務。

Firebase的雲端服務可說是前端工程師的福音，讓你不必太過深入後端的許多細節，也能夠搭建後端server與database。

Firebase提供兩種SDK：

1. Firebase-Admin SDK：

用於受信任伺服器環境中運行的應用程式。

所謂受信任環境，通常是你自己的後端伺服器、Firebase Cloud Functions 或其他 Google Cloud 服務。

Firebase-Admin SDK提供開發者對 Firebase 專案的擁有「管理員」級別的存取權限。

2. Firebase-client SDK：

Firebase-client SDK讓前端應用程式（包括網頁與App）能夠直接與Firebase資料庫互動。

## 專案設定

接下來，我們會使用到以上兩類SDK，在Next.js中實作身份驗證。

由於本回會特別聚焦在Firebase的身份驗證實作，Next.js安裝就不贅述了，筆者就假設你已經初始化完成Next.js專案。

首先來到Firebase的官網：

![Firebase首頁](/firebase-main.png)

使用大家都有的google帳號（你肯定有吧？）登入Firebase後，點擊右上角的go to console：

### 啟用Firebase以及身份驗證服務

點選「開始使用Firebase專案」：

![Firebase啟用1](/firebase-start-project.png)

建立專案，輸入你的專案名稱，並看你要不要加入開發者計劃以及順帶啟用Gemini以及Google Analytics：

![Firebase啟用2](/firebase-create-project1.png)
![Firebase啟用2](/firebase-create-project2.png)
![Firebase啟用3](/firebase-create-project3.png)

筆者是有加入開發者計劃（免費方案），雖然啟用流程的截圖看起來有點選，但由於筆者的專案目前用不上Gemini以及Google Analytics，所以實際上並沒有啟用。

最後當然點選建立專案：

![Firebase啟用4](/firebase-create-project4.png)

等待Firebase建立

![Firebase啟用完成](/firebase-create-project-wait.png)

建立完成後，會來到Firebase的控制台首頁，往下滑動，或是左邊側邊欄有個Authentication的按鈕，點擊進入：

![Firebase Auth](/firebase-auth.png)

在Authentication頁面點擊畫面中的「開始使用」：

![Firebase Auth Start](/firebase-auth-start.png)

啟用Authentication後，在登入方式的tab下，選擇要啟用的登入方式，這裡我們選用最傳統的「電子郵件/密碼」：

![Firebase Auth1](/firebase-auth1.png)
![Firebase Auth2](/firebase-auth2.png)

選擇啟用後儲存，就可以看到「電子郵件/密碼」的登入方式已啟用：

![Firebase Auth3](/firebase-auth3.png)

接下來我們要啟用資料庫`Firestore`，點開左邊側邊欄的建構後，會有個`Firestore Database`，進入後點擊「建立資料庫」按鈕：

![Firebase DB](/firebase-db.png)

會進入到建立資料庫的設定，資料庫ID的部分就讓它維持default，而資料庫位置可以選離你最近的地點即可。最後以「正式版」啟動資料庫：

![Firebase DB1](/firebase-db1.png)
![Firebase DB2](/firebase-db2.png)

再來，回到專案總覽，也就是firebase控制台的首頁，點及網頁開發的icon：</>

![Firebase Dev](/firebase-dev.png)

新增你的前端專案，輸入專案名稱，目前不選在Firebase託管，Next.js的專案我大都選擇它的老家Vercel（或是選你喜歡的部署平台）：

![Firebase Dev1](/firebase-dev1.png)

註冊完後在Next.js安裝Firebase-client SDK：

```
npm install firebase
```

然後複製頁面上的程式碼到你的專案中，建立：firebase/client.ts後，貼上剛剛在Firebase頁面的程式碼。

大致上會像這樣：

```typescript
// firebase/client.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // 你可以將以下key放到環境變數：.env檔案內
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 初始化 Firebase 應用程式
const app = initializeApp(firebaseConfig);
// 取得身份驗證實例
export const auth = getAuth(app);
// 取得Firestore 資料庫實例
export const db = getFirestore(app);
```

接著回到Firebase控制台頁面，看到側邊欄的專案總覽，點擊設定的齒輪icon後，點選menu中的「專案設定」：

![Firebase Dev2](/firebase-dev2.png)

來到專案設定頁面，點選「服務帳戶」的tab，會出現Firebase Admin SDK：

![Firebase Dev3](/firebase-dev3.png)

滑到下方，會有個「產生新的私密金鑰」按鈕，點擊後會自動下載一個json檔，裡面是Firebase Admin的金鑰，請務必、務必、務必保管好，並且不要洩漏這組json密鑰，因為有了這組密鑰，你的firebase等於空門大開，任人操弄。

![Firebase Dev4](/firebase-dev4.png)

將密鑰JSON檔案中的`project_id`、`private_key`、`client_email`新增到.env.local檔案中（沒有就在專案根目錄建立一個）。

小提醒：JSON密鑰的環境變數，千萬不能加上NEXT_PUBLIC，這樣會在運行應用程式時會暴露到前端。

雖然client sdk的環境變數會暴露在前端，但由於它不像Admin SDK擁有完全的存取權限，並且會受限於Firebase內部的安全規則，因此client sdk的環境變數可以用NEXT_PUBLIC當前綴，而Admin SDK環境變數千萬不能用NEXT_PUBLIC當前綴，以避免在前端暴露。

接著安裝Firebase Admin SDK：
```
npm install firebase-admin --save
```

## 在Next.js中實作Firebase身份驗證

如果單純只有進行身份驗證的話，Firebase Client SDK就能在client side直接搞定。

它支援註冊、登入、登出、密碼重設、安全處理憑證、使用者狀態管理以及多種驗證方式的支援，可謂是一站式服務。

但如果你的Next.js還需要進行路由保護、server side資料請求（驗證通過，請求才會准許）的話，就必須結合Firebase Admin SDK，在Firebase Client SDK身份驗證後獲取ID Token，再將ID Token傳入Firebase Admin SDK中進行後續的處理。

完成安裝後，我們在Next.js專案內新增檔案：firebase/admin.ts，並加入以下程式碼：

```typescript
// firebase/admin.ts
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const initFirebaseAdmin = () => {
  const app = getApps();

  // 確保不重複初始化
  if (!app.length) {
    initializeApp({
      credential: cert({
        // 取用剛新增的firebase admin密鑰
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // 由於PRIVATE_KEY的格式，我們會需要將它做轉換
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }

  return {
    auth: getAuth(),
    db: getFirestore(),
  };
};

export const { auth, db } = initFirebaseAdmin();
```

以上需要特別注意的是，剛剛我們在JSON密鑰中取得的`private_key`，它跟其他環境變數的長相特別不同，是相當長的一大串，需要進行額外處理，所以在設置好環境變數`FIREBASE_PRIVATE_KEY`，並將原先JSON密鑰的`private_key`複製過來後，在進行轉換的動作：`process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")`。

初始化完成後，接下來可以在Next.js中，使用React Server Action，在server side處理Firebase的身份驗證邏輯。

### 什麼是 React Server Actions？
[React Server Actions](https://nextjs.org/docs/app/guides/forms)是在Server Side執行[Server Functions](https://react.dev/reference/rsc/server-functions)。

無論Server Components還是Client Components，都可以呼叫Server Actions來處理表單提交，尤其是我們待會要來處理的身份驗證。

以下是一個大幅簡化的身份驗證表單，是登入以及註冊都能複用的元件，雖然有用上`zod`與`useForm`等方便表單驗證的套件，但由於本回聚焦在身份驗證的實作，因此表單欄位的UI部分就省略，留給各位自行發揮囉！

```tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { auth } from "@/firebase/client";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { signIn, signUp } from "@/lib/actions/auth";

// zod驗證表單欄位
const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          // 錯誤跳toast通知，以下成功亦同
          toast.error(result.message);
          return;
        }

        toast.success("帳號註冊成功！請使用帳號登入");
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("登入失敗，請再試一次！");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("登入成功");
      }
    } catch (error) {
      console.log(error);
      toast.error(`發生以下錯誤：${error}`);
    }
  };

// 控制表單條件渲染：登入表單或註冊表單
  const isSignIn = type === "sign-in";

  return (
    <div>
        <h2>表單</h2>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
          >
          // 本回聚焦在身份驗證的實作邏輯，UI部分就留給大家發揮 
          </form>
    </div>
  );
};

export default AuthForm;
```

在上面的表單元件中，有用上Firebase Client SDK提供的`createUserWithEmailAndPassword`、`signInWithEmailAndPassword`，還有我們先前在`firebase/client.ts`中，使用Firebase Client SDK初始化的`auth`，這些就足夠讓這個client component完成註冊、登入及登出的功能。

眼尖的你會發現，處理表單送出的邏輯內，還有另外用上`import { signIn, signUp } from "@/lib/actions/auth"`的函式，這是接下來要來實作的Server Actions，也就是會用上Firebase Admin SDK的部分。

我們已經完成身份驗證表單的部分，接著建立檔案：lib/actions/auth.ts，並加入以下內容：

```tsx
// lib/actions/auth.ts
// 在檔案頂部明確標注"use server"，讓Next.js知道這隻檔案的邏輯處理都必須在server side進行
"use server";

// 引入我們先前初始化完成的firebase admin sdk
import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

interface User {
  name: string;
  email: string;
  id: string;
}

// 設定Session 效期 (預設為1週)，由於為毫秒，所以要 * 1000
const SESSION_DURATION = 60 * 60 * 24 * 7 * 1000;

// 設定 session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // 建立 session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION, 
  });

  // 在瀏覽器中set cookie
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}


// 帳號註冊
export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // 檢查資料庫中，是否存在使用者資料
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists)
      return {
        success: false,
        message: "帳號已存在，請使用帳號登入"
      };

    // 在Firestore資料庫中建立使用者資料
    await db.collection("users").doc(uid).set({
      name,
      email,
      // 你可以依照需求加入其他的使用者資料,
    });

    return {
      success: true,
      message: "帳號建立成功，請使用建立的帳號登入",
    };
  } catch (error: unknown) {
    console.error("Error creating user:", error);

    // 處理 Firebase errors
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "此Email已註冊",
      };
    }

    return {
      success: false,
      message: "建立帳號失敗，請再試一次",
    };
  }
}

// 登入，身份驗證
export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord)
      return {
        success: false,
        message: "帳號不存在，請問註冊帳號",
      };

    await setSessionCookie(idToken);
  } catch (error: unknown) {
    console.error(error);

    return {
      success: false,
      message: "登入失敗，請再試一次",
    };
  }
}

// 登出：清出session cookie的使用者資料
export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.delete("session");
}

// 從session cookie取得當前使用者資料
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // 從資料庫中取得使用者資料
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log(error);

    // 無效或過期 session
    return null;
  }
}

// 檢查使用者是否通過身份驗證
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

```
以上分別實作了session cookie、註冊、登入以及維持登入狀態的功能，先impoert先前在：`firebase/admin.ts`中，初始化的Firebase Admin SDK後，接下來就可以使用初始化後的auth、db來對Firebase進行操作。

其中`signIn`、`signUp`會在表單元件中接收參數，你會注意到有的參數是使用透過Firebase Client SDK所取得的使用者驗證資料，這讓我們可以在Next.js專案內，進一步控制身份驗證的流程。

而`isAuthenticated`可以放在需要保護的路由內，我們可以讓layout.tsx預設為server component，並且在元件內使用`isAuthenticated`，在server side驗證目前使用者是否可以進入layout.tsx內的路由，若是驗證失敗則直接Redirect。

`getCurrentUser`除了放在`isAuthenticated`進行路由保護外，在後續向Firebase進行資料請求時也能用上，當使用者未登入，也就是`getCurrentUser`回傳`null`時，這個請求就直接中斷，阻止未經授權的資料請求。

## 結語

用上人人都有的Google帳號（你應該有吧？），前端開發者就能輕易地啟用Firebase，讓你的前端專案建構身份驗證功能以及資料庫。

這讓前端開發者不必過於費心後端的環節，立刻就能夠搭建並串接起一個初步的全端應用，無論是想進行MVP Demo，或是快速將你的想法實現並投入測試，希望以上的操作分享，能夠幫上看到這一篇的你。