---
title: "用Astro無痛code出自己的部落格：元件與佈局"
pubDate: 2025-02-19
description: "網頁開發者還在煩惱該怎麼建立自己的個人網站嗎？快來試試Astro，這款打造個人部落格／作品集的神器吧！"
author: 江森
image:
  url: "/start-building-your-web-with-astro-component-layout.png"
  alt: "Cover Picture"
tags: ["Front-end", "Astro", "Blog"]
---

## 前言

若是熟悉元件與框架的讀者可以跳過前言，前言筆者想先跟接觸網頁開發不久的新手，快速地對齊一下認知。

當前端開發來到框架的學習階段時，我們會需要培養元件（component）化的眼光來看待UI的建構。

什麼是元件（component）呢？簡單說就是在使用者介面中，會重複用到的畫面元素，像是常見的Button按鈕、Navigation導航連結、Form表單等等，你在逛許多網站或App常會看到、使用的組成部分。

為什麼來到前端開發的框架階段，會需要培養元件化的眼光，或者該說思維呢？

因為許多前端框架的實作，會把重複使用的UI，抽取出來另外建構成元件，開發者只要維護這個元件，並且在需要用到的地方引入即可。

如果不採取這種做法，那在網站的不同頁面會使用到Button時，開發者就必須在每一處都重寫一個Button，這不只是HTML與CSS樣式，還包含互動用的JavaScript邏輯。

你可以想像當網站的頁面變多，開發的規模變大時，對開發者來說會是多麽恐怖的一件事。

以上面的例子來說，每次都重寫Button違反了程式開發的DIY（Don't Repeat Yourself）原則。

我們已經了解Component是UI畫面中，會重複使用或類似的組成部分，而由多個Component組成的集合，這個集合又會在多個頁面重複使用時，就叫做Layout。

你可以把Layout想像成衣服，組成衣服的鈕扣、拉鏈、口袋等，就是Component，Layout就是由這些個別的Component組成的。

雖然不同的頁面會有不同的內容，但是在同一個網站中，為了維持風格的一致性，不同的頁面會使用相同或類似的Layout，你可以想像成有的公司為了強調品牌形象，會讓員工穿著風格統一的制服一樣。

有了前面的觀念後，接著就開始來認識Astro中的Component與Layout吧！

## 在Astro中使用元件

你可以在`/src`中建立一個components資料夾，這個資料夾會放你準備建立的Component，例如：PrimaryButton.astro、Header.astro、PostsList.astro等等。

在檔案的命名上通常會採用大駝峰，也就是首字大寫的Camel Case作法，這是用來區分HTML原本的元素，還是你自己實作的Component。

拿官網範例來說，我們在網站中常見的頁頭，也就是Header的部分，通常這裡會放站內各個主要頁面的連結。

就像這樣：

```javascript
// src/components/Header.astro
---
---
<header>
 <nav class="nav-links">
   <a href="/">首頁</a>
   <a href="/about">關於我</a>
   <a href="/blog">文章</a>
 </nav>
</header>

```

但通常來說，Header可能還會放其他區塊元素，而不會只放站內連結。

這時我們可以把站內連結視為另一個Component，把它抽取出來另外維護，並放到Header當中，就像這樣：

1. 先抓出來
```javascript
// src/components/Navigation.astro
---
---
<nav class="nav-links">
  <a href="/">首頁</a>
  <a href="/about/">關於我</a>
  <a href="/blog/">文章</a>
</nav>

```
2. 再放到Header.astro

```javascript
// src/components/Header.astro
---
import Navigation from './Navigation.astro';
---
<header>
  <div>網站的Logo</ div>
  <Navigation />
</header>

```

3. 最後，在使用到元件的頁面中引入：

```javascript
//src/pages/index.astro

---
import Navigation from '../components/Navigation.astro';
import Header from '../components/Header.astro';

//當然，既然是會重複使用的元件，你可以在全域中設定樣式，就留給你自己調整囉！
import '../styles/global.css';

const pageTitle = "我的網站";
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>{pageTitle}</title>
  </head>
  <body>
    <Header />
    <h1>{pageTitle}</h1>
  </body>
</html>
```

大功告成！

我們已經在Astro專案中，把頁面的UI元件化啦！

## 在Astro中使用Layout

再來了解了Component之後，我們來試著組裝由一系列Component組成的Layout吧！

同樣的起手式，先在`/src`中開一個資料夾`/src/layouts`，建立一個BaseLayout.astro檔案：

```javascript
//src/layouts/BaseLayout.astro
---
import Header from '../components/Header.astro';
import '../styles/global.css';
const pageTitle = "我的網站";
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>{pageTitle}</title>
  </head>
  <body>          
    <Header />
    <h1>{pageTitle}</h1>
    <slot />
  </body>
</html>
```

然後在需要使用到的頁面中引入：

```javascript
//src/pages/index.astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout>
  <h2>首頁的副標題</h2>
</BaseLayout>
```

你有注意到：`<slot />`這個HTML標籤嗎？

中文翻譯為插槽，這是個佔位符，代表你將在Layout的`<slot />`位置填入Layout的頁面內容。

那麼該怎麼放呢？

就在你引入Layout的頁面中，用巢狀結構包起來囉！

```javascript
//src/pages/index.astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout>
  <h2>首頁的副標題</h2>
</BaseLayout>
```

在index.astro頁面h2的部分，就是你在BaseLayout中要放入的內容。

而其他頁面，例如有個關於我頁面：`/src/pages/about.astro`也可以比照辦理：

```javascript
//src/pages/index.astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout>
  <h2>關於我頁面</h2>
</BaseLayout>
```

### 客製化Layout

有了Layout，你就可以在你的網站的不同頁面，輕鬆地重複套用相同的佈局風格。

但是到這裡可能會有人問：雖然我的網站主要風格一致，但是有些頁面的layout會稍微不同，這時候該怎麼辦？

像這種情況，在Astro中，你除了可以利用JS來控制渲染外，還可以使用多個不同的Layout，或是巢狀Layout的方式來解決。

例如在部落格文章頁面中，雖然與一般頁面的Layout雖然相似，但有些樣式與元件會略有不同，這時可以創一個文章專用的Layout，並把這個Layout放在主要Layout當中，就像這樣這樣：

```javascript
//src/layouts/PostLayout.astro
---
import BaseLayout from "./BaseLayout.astro";
---
<BaseLayout>
    <article>
      <h1>文章標題</h1>
      <div>
        <slot />//文章頁面的內容會放在這個位置
      </div>
    </article>
</BaseLayout>
```

我們可以看到這個文章頁面用的PostLayout，其實是包在BaseLayout當中，然後再把差異的部分做微調。

你也可以使用傳入props的方式，根據頁面的不同來決定Layout的模樣，就像這樣：

```javascript
//src/layouts/PostLayout.astro
---
import BaseLayout from "./BaseLayout.astro";
const { articleTitle } = Astro.props;
---
<BaseLayout >
    <article>
      <h1>{articleTitle}</h1>
      <div>
        <slot />//文章頁面的內容會放在這個位置
      </div>
    </article>
</BaseLayout>
```

```javascript
// src/pages/firstPost.astro
---
import PostLayout from '../../layouts/PostLayout.astro';
---

<PostLayout articleTitle="第一篇文章">
  <div>文章內容<div />
</PostLayout>
```

共用Layout是為了讓你的網站在風格與調性上保持一致，風格不一就很像去麥當勞看到肉燥飯在菜單上，或是在用餐區看到有迴轉壽司的迴轉檯一樣突兀。

但有時候真的會需要將一些特定頁面做額外處理，這個頁面的Layout與其他的頁面完全不同，需要整個打掉重練時，也可以另外創一個專用的layout：

```javascript
//src/layouts/SpecialLayout.astro
---
import Header from '../components/Header.astro';
import '../styles/global.css';
const pageTitle = "我的網站的特別頁面";
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>{pageTitle}</title>
  </head>
  <body>          
    <Header />
    <h1>{pageTitle}</h1>
    <slot />
  </body>
</html>

```
但是別忘記，如果是獨立Layout的話，那這個Layout就必須包含完整HTML skeleton，該有的html、head、body等主要標籤都要加上去。

## 小結

上回我們嘗試在Astro專案中建立頁面，這回我們開始將頁面拆解，用元件化的眼光來重新構築Astro專案，並且了解了決定網站整體架構與風格的佈局Layout。

有了這兩個概念，我們在網站開發上又有了新的利器，可以用更高的視角來規劃、建構自己的網站。

## 參考資料
> Astro 官網建立部落格教程：
> https://docs.astro.build/en/tutorial/0-introduction/