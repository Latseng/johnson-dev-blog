---
title: '【筆記】快速搭建頁面的好幫手－UI元件庫Ant Design入門：Button元件'
author: 江森
description: 'Ant Design入門：Button元件'
pubDate: 2024-11-10
image:
      url: 'https://res.cloudinary.com/dsxtz8rud/image/upload/v1733738839/get-start-ui-library-with-ant-design_wgzsio.webp'
      alt: 'cover picture'
tags: ["Front-end", "UI-library"]
draft: false
---

在前端開發的路上，一定會接觸到 Bootstrap 這個知名的 CSS 框架。它提供了許多頁面常見的元件，像是：按鈕、輸入框、表單等等，讓開發者可以節省許多時間，將心力放在其他重要或邏輯比較複雜的部分。

我第一次接觸 Bootstrap 這項工具時，大驚失色：「怎麼會有這樣方ㄊㄡ便ㄌㄢ ˇ 的東西？工程師的世界真是太神奇了！」

之後我的前端開發之路，來到號稱前端三大框架之一的 React（React 到底算框架還是函式庫呢？前端社群目前還在爭論中，但今天沒有要探討這個爭點）的坑，開始練習運用元件思維來建構網頁後，我更發現了開源 UI 元件庫的廣大世界。

原來開發社群有許多大神，共同出力並發展出這樣廣大的生態系，我突然覺得好像來到什麼桃花源（也可能是另外一個大坑？）。

原先必須從選用 HTML 標籤開始，再慢慢調整 CSS 樣式的繁瑣過程，有了 UI 元件庫只要幾個指令引用，就能快速搭建出一個初步的頁面。

這種感覺就好像是你原本要一針一線地編織衣物，突然給你一些現成的衣料部件，讓你可以用魔鬼氈，或拉鍊就組裝好一件衣服一樣驚奇。

雖然 Bootstrap 也可以用在像 React 這樣的框架上，但在前端生態系中，有更多跟框架搭配更完善的工具可以選用，像是熱門的 MUI、Ant Design，以及 Bootstrap 針對 React 優化的 React Bootstrap 等等的 UI 元件工具。

而這一回，我被一位在業界的前端前輩推坑 Ant Design，基於之前就有使用過 Bootstrap，所以就想來試試看不一樣的工具，所以就來玩玩看 Ant Design 吧！

身為開發者，在使用開源工具之前，不免俗要來看一下官方文件。

Ant Design 的開發文件頁面，頂部直接寫明為 React 專用。似乎另外有針對 Vue 的版本，但我目前專注在 React 上，Vue 的部分還沒有研究，如果有專精 Vue 的大大可以留言補充。

首先是

## 安裝

在你的 React 專案資料夾當中，使用以下指令：

`npm install antd --save`

我們先從最常見的元件-按鈕（Button）開始。

按鈕即一個可以點擊的視覺區塊，是相當常見的 UI 元件，HTML 提供的 button 標籤，預設的樣式相當陽春，就像還沒有調理過的食材。

我想應該鮮少會有人將未經樣式調整的「生」標籤，直接放到產品上吧？

安裝完後，在要使用 Button 的檔案中

## 引入元件

```jsx
import { Button } from 'antd';
const Example = () => (
  <div>
    <Button type="primary">我是按鈕</Button>
  </div>
);
export default App;
```

如此一來，在你的畫面上就有了一個現成的 Button 元件，供你擺弄囉。

## 樣式調整

注意到 Button 元件中有個 type 屬性嗎？那是 Ant Design 提供調整按鈕樣式的 API。

在 Ant Design 官方提供的元件中，每一個元件都會附有文件示範元件的長相以及範例程式碼。在這些文件的下方，有個標題為 API 的段落，會列出他們家的元件，有哪些可供調整的屬性。

以 Button 為例，它的 type 屬性可放入的 value 為 string，有四種樣式可以選用，分別為：

primary（主要按鈕樣式）
dashed（虛線邊框）
link（連結）
default（預設）

其中最常用的 primary，官方預設為藍底白內文。而 default 則沒有樣式，hover 時，Button 的邊框、內文轉成藍色。

如果你覺得以上提供的還不夠你用，官方 API 開放的屬性還有 color 可以設定，可以放入的值同樣為字串，有三種可以選用：default、primary、danger。

其中我常用來提示使用者慎重操作的紅色按鈕，就是 danger，不過是使用屬性而非 color 的值，就像底下的：

```jsx
<Button danger={true}>我是按鈕</Button>
```

danger 這個屬性，可以放入的值為 boolean，像範例中 danger 的值為 true，即為啟用樣式，或是直接省略直即默認為啟用：

```jsx
<Button danger>我是按鈕</Button>
```

反之 false 就是不啟用，或是以放入變數的方式，來達到控制樣式的效果。

當然你如果還想做其他的調整，官方 API 還有其他屬性，可以嘗試看看，像是 disabled（禁用狀態）、size、甚至供你加入 CSS 客製化樣式的 style，以及我們熟悉的事件處理：onClick 等等屬性。

## 小結

UI 元件庫雖然開箱即用，非常方便，省去開發者大量的時間在刻元件上。但回過頭來，UI 元件庫算是一種提升效率的工具，工具一定是使用者有意識地去駕馭，而非無意識地依賴。

我們不是要讓工具取代開發者的能力，尤其對前端開發來說，刻畫面跟元件是基本功。

我們之所以選用 UI 元件庫，是為了不重複造輪子，並嘗試跟上技術社群的發展，在提升效率同時，讓開發者能專注在更重要的問題上。
