---
title: "【React筆記】從fetching data開始的useEffect"
author: 江森
description: "React心得，useEffect初步使用經驗談"
pubDate: 2025-01-19
image:
  url: "useEffect-fetch-data_zhhe3y"
  alt: "cover picture"
tags: ["Front-end", "React"]
draft: false
---

## 前言

由於最近都在玩 Astro，差點沒忘記自己是從 React 起家的。所以今天就想來分享一下，開始用 React 進行開發以來，第二常用，但卻不容易理解與上手的 Hook：useEffect！

## 什麼是 useEffect？

說起 useEffect，我想對剛接觸 React 的開發者來說，對這個 Hook 的初步印象，應該就是用來處理「副作用」的 Hook。

根據 React 官方的定義，useEffect 是一個讓你可以將 component 與外部系統「同步」的 React Hook。

等等，什麼「副作用」？什麼「與外部系統同步」？出現了兩個讓人摸不著頭緒的術語。

## effect

全名：side effect，翻譯成副作用，乍看之下很像看診完拿到的藥袋上會寫的醫學名詞。

我當初也是對這個詞感到相當困惑，後來理解到，原來「不純」的函式就會產生副作用。

那什麼又是「不純」的函式呢？

如果一個函式除了回傳結果值外，還會影響這個函式外部的環境資料，或是被外部系統影響，也就是所謂的依賴，那麼這些外部影響與依賴，就是所謂的「副作用」。

反過來說，如果一個函式只會回傳結果值，再加上，這個函式你只要給它相同的輸入，就會產生相同的輸出，那麼這個函式就會稱為「純函式」。

像建構 UI 用的 React component function 就是純函式，因為它的任務很單純：就是回傳渲染要用的 React element。

既然叫「副作用」，想必是帶來了預料之外的影響吧？

沒錯，雖然資訊領域的「副作用」跟醫學領域「副作用」的定義不同，但有個相似的地方在於，程式中的「副作用」並非只會帶來壞處。

有時候，在程式設計上，我們可能會需要在函式中進行副作用的處理，像是等下要示範的 fetching data。

但副作用麻煩的地方在於很容易產生「驚喜」。

就像知名的藍色小藥丸威而鋼，當初的設計本來是打算用來治療心血管疾病，讓男性的小兄弟打起精神只是個沒預料到的「副作用」...咳咳，離題了。

總之，在程式開發的原則上，會盡量避免帶有「副作用」的函式，盡可能使用「純函式」。

因為這類函式容易產生預料之外的影響，這已經不是藍色小藥丸帶來的驚喜而是「驚嚇」，像是讓你的程式的可讀性降低，維護與除錯困難，甚至拖累效能等等。

而在使用 React 進行開發，常見的副作用像是本次要示範的 fetch data，還有修改函式外的變數、用 Browser API 直接修改 DOM、存取 localStorage 等等，這些都算是常見的影響外部系統的行為。

## 為什麼需要 useEffect？

由於 React component function 的任務就是產生渲染需要的材料，而畫面發生更新，進行 re-render 時，React component function 就會被重新呼叫。

如果直接在 React component function 處理副作用，像是 Data fetching、修改函式外的變數、用 Browser API 修改 DOM、存取 localStorage 等等，那畫面一旦更新或是一直更新時，這些與畫面更新無關的副作用就會一直被執行。

你應該可以想像我只是要更新個畫面而已，但是卻莫名其妙一直請求資料、一直修改函式外的資料、一直呼叫 API、一直添加事件監聽、一直把資料存到 localStorage，這些失控的行為會讓單純的渲染搞到一團亂。

## 副作用處理－請求資料

但有時候我們又非得跟外部系統同步，就像這次的主題：fetching data 一樣，那在寫 React 的 component function 時，該怎麼辦呢？

當然就得請出本次的主角 useEffect 這個 React Hook 啦！

先介紹一下 useEffect 的基本用法，useEffect 被 import 後，會在 component function 內部當作一個函式呼叫，像這樣：

```javascript
useEffect(setup, dependencies?)
```

但這個 Hook 光呼叫還不夠，裡面必須放入參數。

第一個參數 setup 必放，這是你要用來處理副作用的函式，等等會示範進行 data fetching 的處理。

第二個參數 dependencies 需要看狀況填入，是這個參數為陣列，陣列中的元素為 useEffect 的依賴項目。

直接上示範比較容易理解 useEffect 在幹嘛：

```javascript
import { useEffect, useState } from "react";

export default function UserList() {
  const [users, setUsers] = useState([]);

  //呼叫useEffect
  useEffect(() => {
    //第一個參數arrow function為副作用處理函式
    //在副作用處理函式內，定義fetch data 的函式
    const fetchUsers = async () => {
      const response = await fetch("https://example.com/api/users");
      const data = await response.json();
      setUsers(data);
    };
    //進行data fetching
    fetchUsers();
  }, []); //沒有依賴其他資料，所以第二個參數陣列留空

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

以上就是 useEffect 拿來 fetch data 時的基本用法，看起來不難對吧？

當然實際使用上還會再更複雜一些，像是 useEffect 的第二個參數陣列會依賴到 useEffect 外的資料，該如何解決這些依賴問題，這就留待之後的 useEffect 踩雷經驗分享吧！

## 清除函式

useEEfect 的第一個參數，也就是副作用處理函式，有時候會需要回傳一個「清除函式」，用來清除掉副作用的持續影響。

因為有的副作用我們不希望因為 component 更新，讓副作用一直被重複執行、效果疊加，或者是 component umount 後，副作用卻繼續存在，像是條件渲染的條件改變，會是使用者的路由切換等。

最常見的例子就是事件監聽。

由於事件監聽的添加和 component function 的渲染沒有直接的關聯，所以也算是副作用的一種，如果加入事件監聽後，沒有設定移除機制，事件監聽器會一直存在，可能導致記憶體洩漏或非預期的行為。

就像這樣：

```javascript
import { useState, useEffect } from "react";

function ClickCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const handleClick = () => {
      setCount((prevCount) => prevCount + 1);
    };

    window.addEventListener("click", handleClick);

    // 清除函式
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return <div>You've clicked {count} times</div>;
}
```

在 React 的官方文件中，有個示範的案例為，使用 useEffect 連線到外部系統的聊天室，當使用者離開或是切換聊天室時，就會需要用上清除函式來中斷原本的聊天室連線。

## 結語

雖然網路上關於 react 開發推薦的 data fetching 方法有很多，像是用 server component 直接在 server-side 用 ORM 或是資料庫操作語法來直接獲取資料、或是在 client-side 使用第三方函式庫像 React Query 等等。

但對於剛入門 React 的開發者，useEffect 應該是初次嘗試進行 data fetching 的方式，也是第一次使用到 useEffect 這個 React Hook。

useEffect 對入門的 React 開發者來說算是難關之一，我當初也是被副作用、依賴陣列、清除函式等各式術語困惑、打轉，第一次碰到它就是拿來串接 API 進行 data fetching。

直到看了 Zet 大大對 React 的觀念解析，還有官方對 useEffect 的解釋：這是個讓你可以同步外部系統的 React Hook。（因為 React 的 component function 的目的沒打算跟「外部系統」打交道，它只想 return 渲染要用的 React element）

我才逐漸熟悉這個 Hook。

希望這篇可以幫到在 useEffect 的觀念中打轉，以及在 React 入門 fetching data 的開發者。

## 參考資料：

> React 官方文件：https://react.dev/reference/react/useEffect

> [《React 思維進化：一次打破常見的觀念誤解，躍升專業前端開發者》](https://www.books.com.tw/products/0010982322?sloc=main)——作者：周昱安（Zet）

> ExplainThis-什麼是純函數：https://www.explainthis.io/zh-hant/swe/react-pure-function

> How to fetch data in React [2024]：https://www.robinwieruch.de/react-fetching-data/
