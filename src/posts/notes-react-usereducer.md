---
title: "【React筆記】用useReducer幫你管理複雜的狀態"
author: 江森
description: "只會用useState控制渲染嗎？試試看useReducer吧！"
pubDate: 2025-04-12
image:
  url: "/lautaro-react.jpg"
  alt: "cover picture"
tags: ["Front-end", "React"]
---
## 前言

入門React，我們通常從`useState`開始，了解Hook、渲染，還有畫面更新是怎麼一回事。

自前端從Web開發中分家以來，畫面——也就是使用者對產品的第一接觸點，一直都是前端的主場。

如何呈現出預期的畫面，絕對是前端第一大課題。

而要管理好畫面，就必須掌握住狀態控制，以及狀態的更新機制。

所以React會以`useState`——從字面上就明確跟你講是「使用狀態」——當作入門的起點也就毫不意外了。

`useState`的使用說簡單可以很簡單，但深究起來也藏著不少眉角，然而這一回，筆者沒有打算深入`useState`，而是想來談，當`useState`開始扯你在狀態管理上的後腿時，該怎麼辦。

沒錯，當你的專案規模開始變大，需要管理的狀態逐漸增加時，難以避免地，就會開始生出一堆`useState`。

尤其當一個元件可以跟使用者產生多種互動時，`useState`就會快速增生，然後散落在多個的event handler內。

如果碰到需要重構或維護的時候，你就會對這一大坨的`useState`感到懷疑人生。

這就像電視的遙控器被拆分，每個按鈕獨立成一個遙控器：開啟電源是一個遙控器、切換頻道是一個、調整聲量又一個，然後關閉電源也是一個。

你只是想看個電視，就要先找出所有需要的遙控器，我想這應該不是電視了，可能是某種整人的玩具。

如果不想被大量增生的`useState`淹沒，那該怎麼辦呢？

這時候就可以請出本回的主角——`useReducer`了。

## useReducer介紹

`useReducer`同樣是React用來管理狀態更新的Hook。

我們先來瞧瞧它的模樣：

```jsx
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

筆者先逐一點名並初步介紹每個值，之後會進一步解說他們的作用，首先：

1. state

當前狀態值，也就是這次渲染，元件會用到的狀態。

2. dipatch

是一個函式，筆者私自稱它為派發函式，專門發送狀態的更新訊息的跑腿小弟，狀態更新的觸發就靠它。

3. useReducer

就是React的Hook，你可以把想成React給你的，一個專門用來狀態更新的神秘機器，先別管這個機器怎麼運作，你只要先知道它若是要運作，會需要你給它一些東西，然後它運作會給你需要的。

4. reducer

狀態更新機制的核心。

`reducer`接收兩個參數：當前的狀態值`state`跟`action`。

就跟`useState`一樣，每次使用`setState()`更新狀態時，都是以當前狀態的資料為基礎進行更新。

不同的地方在於，`setState()`只管你給它的新狀態值，它用新的資料更新狀態，它不管你的新資料是怎麼來的，而`reducer`則是將更新狀態的機制定義在函式內，`reducer`同時也是個純函式：只要給定相同的輸入，必定返回相同的輸出。這些特性，讓開發者容易維護`reducer`。

而action則是一個物件，這包物件會帶有我們預先定義好的資料，筆者私自稱它為操作種類，操作種類會影響reducer怎麼跑狀態更新的流程，接下來的示範會讓你更清楚以上的抽象描述到底在搞什麼。

5. initialArg跟init

這兩個要放在一起介紹，因為他們倆會一起決定狀態的初始值。

首先是init，它是一個callback function，並且它是可選的。

當狀態初始值是不確定，需要靠某些計算來確定時，就使用init這個函式，並且填入nitialArg當成init呼叫的參數，利用這個參數來計算出初始狀態值。

當初始狀態是確定的，那就以initialArg當成初始值，並且省略init函式。

## 使用情境

當你的元件開始變得複雜，useState開始暴增，然後狀態之間又有相依性時，我們可以考慮將useState換成useReducer。

這種情境常會出現在表單上，尤其是表單的欄位會互相影響時，就像以下的情況：

```jsx
import { useReducer } from 'react';

const initialState = {
  name: '',
  email: '',
  age: '',
};

function formReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      // 更新特定欄位的值
      return {
        ...state,
        [action.field]: action.value,
      };
    case 'RESET_FORM':
      // 重置表單
      return initialState;
    default:
      return state; // 對於未定義 action，直接返回當前狀態
  }
}

function ComplexForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleChange = (e) => {
    // Dispatch Action 來更新狀態
    dispatch({
      type: 'UPDATE_FIELD',
      field: e.target.name, // e.g., 'name', 'email', 'age'
      value: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('表單提交:', state);
    dispatch({ type: 'RESET_FORM' }); // 提交後重置
  };

  const isSubmitDisabled = state.name.trim() === '' || state.email.trim() === '' || state.age.trim() === ''

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          姓名:
          <input
            type="text"
            name="name"
            value={state.name}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          電子郵件:
          <input
            type="email"
            name="email"
            value={state.email}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          年齡:
          <input
            type="number"
            name="age"
            value={state.age}
            onChange={handleChange}
          />
        </label>
      </div>
      <button type="submit" disabled={isSubmitDisabled}>提交</button>
      <button type="button" onClick={() => dispatch({ type: 'RESET_FORM' })}>
        重置
      </button>
    </form>
  );
}

export default ComplexForm;
```

## 情境解析

筆者來解析一下上面的程式碼，在使用useReducer時的運作。

起手勢別忘了在頂部引入：`import { useReducer } from 'react';`
以及在Function Component內的頂端層呼叫它：`const [state, dispatch] = useReducer(formReducer, initialState);`

再來是初始值`initialState`與`reducer`，由於這兩個資料不會參與re-render，所以可以把它們放到Function Component外面，甚至你想另開一個檔案管理，在另外引入也可以。

初始值就是一開始的狀態，React以初始值作為渲染的起點。

`reducer`為useReducer用來更新狀態的核心機制，我們可以看到以上程式碼中，`reducer`內部包含著定義好的狀態更新流程，輸入`reducer`的`action`參數有個`type`屬性，來讓switch可以決定，該走哪個狀態更新流程，最後回傳新狀態。

而輸入的`state`參數，則是當前狀態，在React中，每一次渲染的狀態資料都是immutable（不可變的），這個特性使得React可以追蹤與控制每一次的re-render，因此`useReudcer`就跟`useState`一樣，會有當前狀態值`state`，這讓React可以用來渲染當前畫面，並使用它來當作更新畫面的基礎。

接著是表單欄位，在輸入操作中所觸發的`onChange`，這個event handler會使用到前面提到的`dispatch`函式，它會觸發狀態更新。

這個函式需要輸入一個參數叫`action`，`action`通常會是一包物件，執行`dispatch`函式並不會回傳值，而是將作為參數的`action`送到`reducer`那進行新狀態值的運算。

`action`這個物件，通常第一個屬性我們會把它命名為`type`，用來定義使用者觸發了什麼操作，我們可以想成操作種類。

至於有哪些操作種類可以更新狀態，通常會定義在`reducer`的內部流程中，讓`reduce`r根據`type`採取相對應的狀態更新計算流程。

而`action`物件的其他屬性則可以自訂，通常會是帶到`reducer`當中，用來計算的資料，在上面程式碼的例子`dispatch`中的`action`為：

```jsx
{
  type: 'UPDATE_FIELD',
  field: e.target.name,
  value: e.target.value,
}
```

其中的`type`表示這次觸發的狀態更新，為輸入欄位的變更，至於變更用到的資料則是`field`與`value`，將這包送到reducer後，就會根據你在`reducer`所定義的流程，回傳新的狀態資料。

最後React會以新的狀態資料re-render，完成UI更新。

## 與`useState`的比較

落落長的行文至此，筆者稍微做一下關於`useReducer`跟`useState`兩者的不專業比較：

1. 狀態更新集中管理

就像在前言中提到的，`useState`的狀態更新，會散落在各個event handler當中，而每個event handler又各自定義了`state`會怎麼改變，當專案規模變大時，散落各處的event handler會讓狀態不容易管理。

而useReducer則是狀態更新的機制，集中到reducer函式中。

2. 預先定義好更新行為

reducer不管使用者做了什麼，它只負責接收派發過來的操作資料，檢查這包操作是否符合已經定義好的狀態更新流程，符合的話，開始跑狀態更新的計算流程，最後回傳新的狀態資料。

3. event handler只負責派發操作

event handler更新狀態的任務被拔除、轉移到reducer當中，變成只負責傳遞操作。

當使用者的行為，符合我們預先定義好的操作時，event handler就只是告知reducer：「該更新了，資料在這，拿去！」

## 結語

筆者之前在的[[JS筆記]Array.reduce()方法
](https://johnson-dev.netlify.app/posts/notes-js-reduce/)
一文當中，也有談到React的`useReducer`和Redux，這兩者狀態的管理機制，就是參考自`array.reducer()`方法。

狀態更新就像陣列迭代，差別在於，陣列的迭代次數，在給定陣列時就確定了，而狀態的變更次數卻不一定。

`array.reduce()`需要填入的callback function就跟`reducer`一樣，預先就決定好每一次執行時該怎麼改變，而累加器就跟Reducer中的`state`一樣，從初始開始變化，每一次的變化結果，都是基於上一次的變化結果。

它們在運作機制上的共通性相當值得玩味，而在釐清邏輯後，我們就能體會到這些工具為程式碼所帶來的簡潔與優雅。

但有時候，筆者還是得提醒：複雜的工具可以簡化複雜的問題；但是在簡單的問題上使用複雜的工具，只會把問題搞複雜。

`useReducer`就是這樣一個工具，有一些小元件，既不複雜也沒有太多的狀態需要管理，這時候其實只要使用`useState`就能簡單處理。

那什麼時候會需要請出`useReducer`呢？

當你發現你的`useState`增加得太快，或是同一個狀態會再多個event handler使用時，才來考慮`useReducer`。

`useReducer`是個很棒的狀態管理Hook，它能幫你整理複雜的狀態資料與更新，但記得：殺雞先別太快用上牛刀！