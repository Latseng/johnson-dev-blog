---
title: "【React筆記】在rendering lists常踩到的雷"
author: 江森
description: "React筆記、心得、踩雷經驗談"
pubDate: 2024-11-11
image:
  url: "lautaro-react_pvqjuo"
  alt: "cover picture"
tags: ["Front-end", "React"]
draft: false
---

## 前言

當前端開發者在嘗試建立頁面時，一定會碰上利用相似的一串資料，例如陣列，來連續渲染
重複結構的元素，到頁面的某個區塊上這種情況。

在 React 中，基於單一資料流原則中的資料不可變性（immutable），所以 React 的官方
文件建議開發者使用 JavaScript 原生的陣列操作方法：.filter()以及.map()，來操作資
料。

舉例來說，例如你拿到一包學生資料如下：

```javascript
const students = [
  {
    id: 1,
    name: "John Doe",
    grade: 10,
    subjects: ["Math", "Science", "English"],
  },
  {
    id: 2,
    name: "Jane Smith",
    grade: 11,
    subjects: ["History", "Art", "Music"],
  },
  {
    id: 3,
    name: "Michael Johnson",
    grade: 12,
    subjects: ["Physics", "Chemistry", "Biology"],
  },
  {
    id: 4,
    name: "Emily Davis",
    grade: 9,
    subjects: ["Math", "English", "Spanish"],
  },
  {
    id: 5,
    name: "David Lee",
    grade: 11,
    subjects: ["Computer Science", "Math", "PE"],
  },
];
```

你打算用這串資料來建立學生列表，在 React 專案中就可以這麼做：

```jsx

const StudentsList = () => {
  return (
    <ul>
      studuents.map(student => (<list key={student.id}>student.name</list>
      ))
    </ul>
  );
};

```

## 雷點

注意到上面 arrow function 的部分，我還在萌新階段，尚在摸索 React 的時候，曾對=>
後面直接接()，而不是{}，感到疑惑。

後來才了解這是 arrow function 的特性： => 的後面如果只有一行時，可以不使用
return 關鍵字，而是用()來直接回傳內容。

再來就是，使用.map() 渲染重複結構的 UI 元件時，注意這樣連續的元件一定要設定
key。

否則渲染出來的 UI 元件可能會出現問題，因為 React 遇到像這種結構類似、連續大量重
複的元件時，是利用 key 來辨別它們，並以此來選擇要操作的資料。

我踩到的雷就是，我雖然有設定 key，但一開始是用陣列的 index 當作元件的 key。一開
始只有顯示畫面還沒有什麼問題，但是正如那句老話：所不出意外的話，馬上就要出意外了
。當我打算將這些元件修改成可以互動，例如 input 表單時，React 執行 re-render 就開
始出現異常。

表單設定了 onChange，但是輸入欄位每打一個字就會解除輸入 focus 狀態，這造成使用者
沒辦法正常輸入文字。找來找去，左思右想才發現是 key 的問題，由於陣列的 index 會因
為你修改陣列而產生變動（其實在 React 不能直接修改陣列，而是用新的取代舊的），前
面有提到 key 是 React 辨識 UI 的方式，當 key 會變動時，React 就不曉得你打算修改
的是哪個 UI，所以異常的出現了。

## 解決方式

所以我們需要將 UI 的 key 保持唯一不變，最好的方式是從後端拿到的資料時就自帶 id，
我們將 id 直接跟 key 綁定。但總會有例外的時候，這種情況，我們可以利用一個叫 uuid
的套件工具來解決。

首先是安裝：

`npm install uuid`

然後在你的 React 專案中引入：

`import { v4 as uuidv4 } from "uuid";`

再來就是在你要使用的地方，呼叫 uuidv4()來產生 id 即可，拿上面的學生列表來舉例：

```jsx
const StudentsList = () => {
  const [studentInfo, setStudentInfo] = useState([]);

  //假設在某個函式中，處理拿到的API資料，並更新狀態管理hook
  setStudentInfo(
    studentDataFromAPI.map((stu) => ({
      id: stu.id,
      name: stu.name,
      grade: stu.grade,
      subjects: stu.subjects.map((item) => ({
        id: uuidv4(), //原先陣列中的元素變成物件，並利用uuid加入id
        subject: item,
      })),
    }))
  );

  return (
    <ul>
      studuentInfo.map((student) => (
      <list key={student.id}>
        <p>姓名：{student.name}</p>
        <p>年級：{student.grade}</p>
        <p>
          科目：
          {student.subjects.map((item) => (
            //加入唯一key，渲染後的行為就可以正常運作
            <span key={item.id}>item.subject</span>
          ))}
        </p>
      </list>
      ));
    </ul>
  );
};

```

## 小結

Rendering List 是在 React 開發上，一定會遭遇的概念，只要掌握住 React 運作的底層
邏輯，像是單一資料來源、資料不可變性（immutable），就可以少踩一點雷。

像這次我踩到 key 唯一性的雷，導致 UI 的行為出現問題，解決方式除了跟後端協調，幫
資料加上 id 外，前端也有這次介紹的工具 uuid 來解決這樣的問題。

在此留下這篇的踩雷紀錄給自己備忘，或是誤打誤撞來到這裡，有緣看到這篇的你。
