---
title: '[JS筆記]我對閉包Closure的當前理解'
author: 江森
description: '筆者學習閉包的心得'
pubDate: 2025-03-31
image:
      url: 'cover-img-javascript_iewu9o'
      alt: 'cover picture'
tags: ["JavaScript"]
draft: false
---

人們對事物的理解就像一段沒有終點的旅程，而當前理解就是在旅途中，對某一個片段的回顧。

我想每一位開發者在剛上手人生中第一個程式語言的時候，應該都會有這樣的經驗：

在某些概念或術語上撞牆，直到實際動手操作個幾回後，才像被電到一樣突然領悟：原來當初卡住你的難關，也不過就是這樣子。

筆者剛接觸閉包這個概念時，就是這樣。

由於不知道這個概念在幹嘛的，所以剛學的當下就直接硬吃：用力逼緊筆者「微薄」的大腦記憶空間，把教學資源講解的概念先背下來再說。

在不了解其所以然，也沒有操作的經驗，更不知道怎麼操作的情況下，果不其然，之後留下來的印象，也只剩「閉包」這兩個字而已。

可能會有人覺得，這真是個填鴨的笨方法，但有些時候，理解這回事，是必須先把所有該知道的事都湊齊後，才有辦法把關聯性串起來。

在理解之前，我們可能對每個部分可能都只有初步的印象。

筆者串起來的時候，是開始使用React實作專案，回過頭來對照閉包的概念時，才恍然大悟：原來閉包就是這樣啊！

本來抽象又陌生的概念，突然變得很有感。

其實閉包（Closure）是個光看命名很難理解，但在JavaScript開發上卻很常使用，同時也很難意識到有在用它的東西。

根據[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)對閉包的定義：

`閉包是將函式與其周遭狀態（詞法環境）的引用捆綁在一起（封閉）的組合。換句話說，閉包讓函式可以存取其外部作用域。在 JavaScript 中，在函式的建立階段，閉包會在每次函式被建立時產生。`

>A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives a function access to its outer scope. In JavaScript, closures are created every time a function is created, at function creation time.


簡單來說，閉包就是函式的一種特性，而且常在函式中「有其他函式」時用上這個特性。

我們再以MDN的例子：

```javascript
function init() {
  var name = "Mozilla";

  function displayName() {
    console.log(name);
  }

  displayName();
}

init();
```

呼叫`init`函式時，會執行定義在其內部的displayName函式，而displaysName函式的作用，是執行console.log()印出name變數。

在displaysName函式內，並沒有定義name變數，這時JavaScript會往外尋找是否存在name，最後在init的作用域內找到並存取name。

閉包讓內部函式能夠存取外部函式定義的變數，這感覺沒什麼。

看起來不過就是函式在使用變數資料時，在自己內部找不到，然後往外找而已嘛！

說簡單也很簡單，但其實有一些眉角才讓閉包成為框架設計所仰仗的特性，以及框架學習者的所必須掌握的門檻。

首先閉包不讓變數影響全域的「大局」。

當變數定義在全域時，確實每一處的函式都可以取用這個變數資料。

但是一支JavaScript程式存在多個函式，多個函式又可能會需要存取多個變數，這種情況，在規模逐漸變大的專案中不可避免。

如果都把變數都定義在全域，一來在全域的變數會隨著專案規模增加，一拖拉庫擠在一起的變數資料，看起來很啊雜，維護起來更啊雜。

再者，有些變數可能會不小心重複定義，造成全域污染的情況。

如果把專案想像成料理，函式就像是每個廚師的工作區域，變數就是廚師將要調理的食材。

專案規模擴大，就像要準備國宴料理的廚師團隊，如果全部的食材攪在一塊（放在全域），那肯定互相影響，可能是熟食被生食污染、或者是牛排出現海鮮的腥味等等。

而閉包的特性讓函式有各自獨立的工作區，每個工作區各自準備自己的工作素材，就像食材就在各個調理專區內取用、處理，不會互相污染。

這樣的區域讓變數資料就像被氣泡包起來一樣。

根據《忍者：JavaScript開發技巧探秘》書中：

>函式定義時為函式即所屬範圍內的變數建立了一個「安全氣泡」。

這個氣泡會包住內部變數，讓函式外部無法存取，內部函式可以用外部函式的資料，你可以想像成炒菜的廚師，會需要備料的廚師已經處理好的食材，但是備料的食材，不能影響到正在擺盤上菜階段的食材。

閉包這樣的特性，讓同一個函式，可以建立多個「獨立」的實例，也就是在React中，可以重複使用的component的概念，用一個簡單的計數器範例（取自《0陷阱！0誤解！8天重新認識JavaScript！》一書）：

```javascript
function counter() {
    var count = 0;

    return function() {
        return ++count;
    }
}

const countFunc = counter();
const countFunc2 = counter();

console.log(countFunc())
console.log(countFunc())
console.log(countFunc())

console.log(countFunc2())
console.log(countFunc2())
console.log(countFunc2())
```

你可以複製下來，貼到瀏覽器的Console中測試，會發現同一支counter函式，被賦值給countFunc、countFunc2兩個變數。

但從console.log的輸出結果來看，這兩個變數各自獨立運作，沒有互相影響，這不就是在實作React時，將Function Component拿來重複使用嘛？

而且我們還可以發現，當counter執行完畢，也就是賦值給countFunc以及countFunc2後，countFunc以及countFunc2在呼叫時（執行counter內部定義的函式），卻仍然可以存取得到執行完畢的counter所定義的變數。

這是因為閉包的形成，是在函式定義時，而非函式呼叫時，它會讓內部函式可以持續存取外部函式的變數，即便外部函式已經執行完畢。

閉包除了能夠讓你在React中實作出可複用元件(reusable component)外，有些Hook也是基於閉包運作，像是：

```javascript
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    setCount(count + 1); // 不會加2，因為 count 變數仍然是從外部取用的值
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

以上程式碼為學習React useState這個Hook的經典陷阱。

由於React更新機制為批次，也就是component內部的程式碼都執行完畢後，在一次rerender。

所以`handleClick`內的`setCount(count + 1)`會全部執行完後才重新渲染，而每次執行`setCount(count + 1)`都因為閉包而抓取外層的`count`變數，由於還未rerender，所以`count`仍然是當次渲染的值。

最後，來總結一下筆者對閉包的「當前理解」：

1. 閉包讓函式可以記住並存取，在定義時，作用域當中的變數資料。
2. 閉包會「包住」函式定義時，在作用域中的變數資料，防止全域污染。
3. 就算函式在「超出其原本作用域」的地方被呼叫，由於閉包的特性，讓這個被呼叫的函式，也能夠存取定義當時，作用域的變數資料。

## 參考資料

> [《0 陷阱！0 誤解！8 天重新認識 JavaScript！》](https://www.books.com.tw/products/0010832387?srsltid=AfmBOorN5mWuIfyyf7Ct7kX2HyPpzWHA7hWCfBKyZd82H-Mg2XOgbZU7)

>[《忍者：JavaScript開發技巧探秘 第二版》](https://www.books.com.tw/products/0010773867?sloc=main)

>[MDN Closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)