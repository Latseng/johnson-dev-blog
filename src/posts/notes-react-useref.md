---
title: "【React筆記】useRef－單向資料流的逃生艙"
author: 江森
description: "除了渲染以外的DOM操控方法"
pubDate: 2025-05-04
image:
  url: "/lautaro-react.jpg"
  alt: "cover picture"
tags: ["Front-end", "React"]
---

## 前言

在React中，當我們需要做渲染控制時，最常使用state綁定資料，以便讓React管理DOM的變更，那你知道在React當中，有個Hook可以讓你用不同的方式進行DOM操作嗎？

那就是在本回要出場useRef這個Hook！

根據官方文件，這是個讓你可以引用「不參與」畫面渲染的資料的React Hook。

既然不參與畫面渲染，那引用它要來幹嘛呢？

我們先來瞧瞧它的模樣：

```javascript
const ref = useRef(initialValue)
```

`useRef`會回傳一個物件，這個物件僅有一個屬性`current`，所以ref會長得像這樣：

```javascript
ref = {
	current: initialValue
}
```

`initialValue`是指定給ref物件`currnet`屬性的值，可以為任意資料型別，這個參數會在初次渲染後，被React忽略。

由於不參與渲染，官網把useRef比喻成React單向資料流的逃生艙，常用在需要直接調用瀏覽器API等，React渲染管理以外的情況，也正因為它不參與渲染，`useRef`綁定的資料不論經過幾次re-render都不會因為Function Component (以下簡稱FC)的重新呼叫而被重置。

## 使用禁忌

禁忌這個詞感覺很嚇人，但如果不先將這個工具的限制講清楚，很容易發生誤用的慘劇，所以筆者先列出在官網文件中，關於這個Hook的注意事項：
1. 你可以修改`ref.current`的屬性值，除非它是state的一部分。
2. 更動`ref.current`的屬性值不會觸發re-render
3. 除了初始化外，渲染期間不要存取`ref.current`，如果一定要存取，建議考慮使用useState。
4. 在嚴格模式，React會呼叫你的component function兩次。ref object也會被建立兩次，但其中一次會被丟棄。如果你的FC是純函式（也必須是），那不影響。

要特別注意的是，你只能在`useEffect`以及`event handler`內讀、寫ref.current資料。

如果你在這兩種情況以外更動ref，會導致額外的副作用，官網文件有特別強調： 除了初始化外，渲染期間不要存取`ref.current`，這是因為ref常會綁定HTML元素，在渲染完成前，ref會是`null`，而event handler只會在渲染結束後執行，所以在event handler內讀寫ref資料才不會發生抓取不到DOM的狀況。

## 常見用法

由於不會觸發re-render，所以ref物件非常適合用來儲存非渲染相關的資料，尤其是在調用瀏覽器的API時，就像以下情況：

1. 儲存`setInterval`回傳的`id`
```javascript
function handleStartClick() {  

const intervalId = setInterval(() => {  

// ...  

}, 1000);  

intervalRef.current = intervalId;  

}
```
`setInterval`這個瀏覽器的API除了用來進行非同步計時外，這個函式還會回傳計時器的id，使用`ref.current`儲存了`interval`函式的id，這讓你可以確實清除前次渲染生成的`interval`函式，避免記憶體洩漏（memory leak）。

2. 避免重複建立物件

筆者曾在一個React專案中，使用第三方套件在頁面中建立地圖物件，這時要用useRef綁定這個物件，並且在re-render時，特別注意不要重複渲染，類似這樣：

```javascript
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const Map = () => {
  const mapContainer = useRef(null);
    const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // 避免重複初始化

      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: "https://demotiles.maplibre.org/style.json",
        center: [0, 0],
        zoom: 1,
        pitch: 40,
      });
    
  }, []);

  return (
    <>
      <div ref={mapContainer} style={{ width: "100%", height: "420px" }} />
    </>
  );
};

export default Map;
```

3. 控制DOM

在官網文件中有一些關於DOM api操作的示範，像是input的focus()、video的play()、pause()，以及scrollIntoView()

控制input欄位的focus：

```javascript
import { useRef } from 'react';//記得引入Hook

export default function Page() {
  const inputRef = useRef(null);//Hook都必須在FC的頂部呼叫
  return (
    <>
      <nav>
        <button onClick={() => {
          inputRef.current.focus();//點擊按鈕後，會focus在輸入欄位
        }}>
          Search
        </button>
      </nav>
      <input
        ref={inputRef}//綁定輸入欄位
        placeholder="Looking for something?"
      />
    </>
  );
}

```

控制HTML的`video`的播放與暫停：

```jsx
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null)
  
  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);
    if(isPlaying) {
      return videoRef.current.pause()
    }
    videoRef.current.play()
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video width="250" ref={videoRef}>
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

4. ref callback
Ref除了可以追蹤單一個DOM，那當DOM是動態生成的時候，像是表列時，該怎麼辦呢？
ref還有一種call back的使用方式，一樣拿官網的範例：

```javascript
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef(null); //`itemsRef` 將不會只是參考單一 DOM 元素，而是用來存儲 Map 物件
  const [catList, setCatList] = useState(setupCatList);

  function scrollToCat(cat) {
    const map = getMap();
    const node = map.get(cat);
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // 初始化Map 
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToCat(catList[0])}>Neo</button>
        <button onClick={() => scrollToCat(catList[5])}>Millie</button>
        <button onClick={() => scrollToCat(catList[9])}>Bella</button>
      </nav>
      <div>
        <ul>
          {catList.map((cat) => (
            <li
              key={cat}
              ref={(node) => {
                const map = getMap();
                map.set(cat, node);

                return () => {
                  map.delete(cat);
                };
              }}
            >
              <img src={cat} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push("https://loremflickr.com/320/240/cat?lock=" + i);
  }

  return catList;
}
```

我們個別拆分出來看，首先是初始化Ref的使用：

```javascript
function getMap() { 
if (!itemsRef.current) { 
itemsRef.current = new Map(); 
} 

return itemsRef.current;
}
```

這個函式讓Ref使用JavaScript的Map物件 ，並確保初始化僅進行一次。

接著看到列表元素的`ref`屬性的部分：
```javascript
ref={(node) => { const map = getMap(); map.set(cat, node); return () => { map.delete(cat); }; }}
```
- `ref` 屬性接受一個函式（ref callback）而不是`ref`物件
- 當元件被掛載時，React 會調用這個函式並傳入實際 DOM 節點(node)
- 我們把這個節點與對應的`cat URL`作為鍵值對存入`Map`物件
- 最後返回一個清除函式，當元素被移除時會被調用，從`Map`中刪除對應的鍵值對

```javascript
function scrollToCat(cat) { 
	const map = getMap(); 
	const node = map.get(cat); 
	node.scrollIntoView({ 
		behavior: "smooth", 
		block: "nearest", 
		inline: "center", 
	}); 
}
```

當點擊按鈕時，呼叫以上函式:

1. 取用綁定在list上的 Map 物件
2. 用`cat URL`作為key獲取對應的 DOM 節點
3. 使用DOM節點的方法： `scrollIntoView()` 讓該元素滾動到可視區域

ref callback的實作方式，可以搭配.map()的陣列渲染，讓你容易管理動態生成的列表元素，而不需要一一為每個元素單獨創建ref。

## 小結

跟useState相同的地方在於，useRef也可以讓我們控制FC內的資料，但是該如何分別哪些情況要選用哪個Hook呢？

渲染控制就是state，無關渲染就是ref。

官網對於這個Hook的特性，形容得相當貼切：useRef就是React單向資料流的逃生艙，它讓你在單向資料流的邏輯中，埋入一個不參與re-render的操控方式。

當開發者需要動用到瀏覽器API時，除了處理副作用使用的useEffect，也可以視情況動用useRef。

## 參考資料

>[useRef](https://react.dev/reference/react/useRef)

>[Referencing Values with Refs](https://react.dev/learn/referencing-values-with-refs)