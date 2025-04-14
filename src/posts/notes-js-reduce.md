---
title: '[JS筆記]Array.reduce()方法'
author: 江森
description: 'JavaScript當中，比較難上手的陣列操作方法'
pubDate: 2025-03-20
image:
      url: '/cover-img-javascript.jpg'
      alt: 'cover picture'
tags: ["JavaScript"]
---
在JavaScript的開發之路上，少不了對於陣列資料的操作處理。

JavaScript原生提供了許多陣列的操作方法，如果你使用過React，相信你對於`array.map()`應該不陌生，它能幫你取得渲染列表用的陣列資料。

還有`array.filter()`方法，它會給你篩選過後的陣列，如果你需要做刪除一類的操作時，`array.filter()`會是很常考慮的選項。

而在一眾陣列操作方法當中，有一個方法相當特別，那就是`array.reduce()`。

為什麼說這個方法很特別呢？

我們先來看在[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)上的介紹示範：
```javascript
const array1 = [1, 2, 3, 4];

const initialValue = 0;
const sumWithInitial = array1.reduce(
  (accumulator, currentValue) => accumulator + currentValue,
  initialValue,
);

console.log(sumWithInitial);
```

在範例中，陣列在執行reduce方法後，輸出了一個值，這個值是把陣列中所有元素加總的結果。

從上面的例子當中可以發現，reduce方法會輸入兩個參數：一個回呼函式（callback function），一個可選的initialValue。

與許多的陣列方法類似，當陣列執行reduce方法時，會對陣列進行遍歷。

reduce方法特別的地方在於，它在遍歷陣列的同時，會使用一個回呼函式作為參數，這個函式叫reducer，它會隨著陣列元素的遍歷，進行資料的迭代處理。

怎麼個迭代法呢？

reducer函式有兩個參數需要輸入：累加器accumulator，以及遍歷陣列時的當前元素currentValue。

累加器accumulator是reducer函式目前迭代的結果，我們先了解到這，後面會進一步解釋。

在遍歷陣列時，reducer開始對輸入的這兩個參數，進行資料操作，並返回處理後的值。

在遍歷途中，reducer會把該次的結果回傳，並且在下一次遍歷執行reducer函式時，上一次的執行結果，會被當成輸入的累加器accumulator參數。

也就是說，每遍歷一個陣列元素，就會呼叫一次reducer，並抓取上一次reducer執行後的結果，就是累加器accumulator參數，然後跟這次的遍歷元素放在一起操作。

回來看到reduce方法，如果`array.reduce()`有用到第二個參數，也就是initialValue，reducer中的累加器就會從給定的initialValue值開始迭代。

由於reduce的第二個參數可選，如果沒有使用到，累加器就會默認陣列的第一個元素開始迭代。

像上面的例子，reduce有設定初始值為0，reducer則隨著陣列遍歷，逐步累加陣列元素，整個reduce執行完成後，回傳陣列元素加總的結果。

reduce方法不只是能用來加總陣列的元素，還有一種特別的資料操作方式，筆者曾在專案開發中實際用上，那就是幫資料「分組」。

就像下面的例子，我們需要將陣列的物件資料，分成水果以及蔬菜兩個組別：

```javascript
const items = [
  { name: "Apple", category: "Fruit" },
  { name: "Carrot", category: "Vegetable" },
  { name: "Banana", category: "Fruit" },
  { name: "Spinach", category: "Vegetable" }
];

const grouped = items.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item.name);
    return acc;
}, {});
```
我們來看一下`items`的分組過程：

reduce開始時，迭代的初始值被設定成空物件：`{}`

在迭代開始時的reducer函式中，由於acc目前是空物件，沒有`item.category`這個屬性，根據邏輯運算子`||`，acc物件的`item.category`屬性初始值為空陣列。

所以遍歷剛開始的`acc[item.category] = acc[item.category] || []`會是`"Fruit": []`

接著會在`"Fruit": []`這個空陣列值當中，推進去第一個`item.name`，這樣第一次的迭代就會是`acc = {"Fruit": ["Apple"]}`。

第二次迭代同理，由於`item.category`為`Vegetable`，acc物件中目前沒有這個屬性，所以`acc[item.category] = acc[item.category] || []`會是`"Vegetable": []`，並且推進去第一個水果，變成`"Vegetable": ["Carrot"]`>

第三次迭代時，累加器不再是空物件，`acc[item.category]`已經存在，所以`acc[item.category] = acc[item.category] || []`會指向原本就有的["Apple"]，並執行`["Apple"].push(item.name)`，變成`["Apple", "Banana"]`。

第四次迭代同理，就不贅述了，最後的結果，acc會是：`{
  Fruit: ["Apple", "Banana"],
  Vegetable: ["Carrot", "Spinach"]
}`，並且將分組完成的資料賦值給grouped。

看到這，我相信你開始混亂了，筆者稍微整理一下reduce的執行過程：
1. reduce方法同樣會遍歷陣列。
2. reduce方法，會使用兩個參數：迭代用的reducer函式，以及可選的初始值。
3. reduce方法若沒有用到第二個參數，則默認使用陣列的第一個元素，這時陣列的遍歷就會從第二個元素開始，因為第一個陣列元素被拿去當作累加器的初始值。
4. 每遍歷一個陣列元素都會執行一次reducer函式，進行資料迭代的處理。
5. 每執行一次reducer，都會輸入兩個參數進行處理：累加器accumulator以及目前遍歷的陣列元素。
6. 每次reducer執行後回傳的結果，都會存進累加器當中，當成下次迭代使用的參數。
7. reduce執行完就會回傳累加器迭代的最終結果。

筆者個人覺得reduce方法不容易理解的點在於，它的操作過程，資訊密度其實相當高。

不像 map、filter 等方法那樣直觀，在遍歷陣列後，回呼函式的返回結果，直接就是回傳陣列的個別元素。

reduce方法進一步涉及到「累積（accumulate）」、迭代的概念，這讓遍歷中的每一次結果都會影響到下一次的操作，所以初學者在剛開始理解時，都需要花點時間才能看出它在遍歷陣列過程中的行為。

這項概念也被用在Redux的reducer，以及React中的useReducer，用來實作狀態管理，利用狀態的「迭代」來實現狀態資料的更新，所以在命名上也是繼承沿用。

所以不只是在陣列操作會遇到reduce，如果你會持續在前端領域中鑽研的話，熟悉它是必要的，因為
~~你會發現reduce的身影潛伏在許多技術當中隨時準備坑你一把~~在接下來的開發之路上，你會很常需要這位老朋友來幫忙處理資料。