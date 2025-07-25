---
title: 用Astro無痛code出自己的部落格：頁面
pubDate: 2024-12-17
description: 網頁開發者還在煩惱該怎麼建立自己的個人網站嗎？快來試試Astro，這款打造個人部落格／作品集的神器吧！
author: 江森
image:
  url: "/start-building-your-web-with-astro-add-pages.jpg"
  alt: "Cover Picture"
tags: ["Front-end", "Astro", "Blog"]
draft: false
---

## 開始Astro專案

上回我們初始化了一個基本的 Astro 專案，這次我們要開始撰寫及建立頁面。

我們看到 Astro 專案的資料夾架構，在/src 有個 pages 資料夾，這裡會放你的網站的各個頁面。

Astro 是 File-based routing，也就是透過檔案來建立各個頁面的路由。

在 pages 資料夾中的一個.astro 檔案就是一個頁面，跟 Next.js 的 file-system routing 有些類似。

專案初始化後，在 src/pages 中有個 index.astro 檔案，打開它，你會發現它相當於一個 HTML 檔案。

你可以在這個.astro檔案內建立 HTML elements，並開始建構你的網站的首頁。

之後建立其他頁面的基本方法，就是在 pages 資料夾當中，新增.astro 檔案。例如：about.astro，它就會變成你的網站的 about 頁面，URL 就會像是這樣：

http://localhost:4321/about

當頁面逐漸增加之後，我們會透過建立 layout，讓使用相同佈局結構的頁面，套用同一個 layout 來減少重複的 HTML elements。

這樣看來.astro 檔案跟 HTML 沒什麼兩樣嘛～你也許會這樣想，但當然沒這麼簡單啦！如果只是建立HTML，那特地找來一個框架，未免也太過大費周章。

Astro 當然有它特殊的語法，但別擔心，你很快就能熟悉它語法的基本運作方式。

根據官方文件，Astro syntax 是 HTML 的超集(superset)。

什麼？超級？超集？講得很像 HTML 經歷了什麼強力的升級一樣？但說穿了，其實就是輕量版的 JSX 語法。

我們可以在.astro 檔案中的最上層，看到：

```
---
---
```

這樣上下兩層的「---」符號，稱作frontmatter，我們可以在其中宣告變數，然後插入到下方的 HTML 語法當中，就像這樣：

```javascript
---
const name = "Astro";
---
<h1>This is my first {name} blog</h1>
```

確實有 JSX 的既視感。

官方文件提到，Astro 語法的設計，加入了 JSX 的特點（官方稱之為 JSX-like，類 JSX），並儘可能降低複雜性，讓 Astro 可以運用 JavaScript Expressions 來對 DOM 進行操作的同時，又盡量保持像 HTML 文件的單純性。

這應該會激起不少，使用過 JSX 語法的前端框架開發者的親切感，而對新手來說又比真正的 JSX 還好入門。

## 新增頁面

接下來，我們試著在專案中新增頁面，就像這樣：src/pages/about.astro

然後在這支檔案中，新增以下內容：

```javascript
<body>
  <a href="/">首頁</a>
  <h1>關於我</h1>
  <p>這是本站「關於我」的頁面，這裡會放上自我介紹，以及建立本站的原由與初衷。</p>
</body>
```

當然，p tag 的內容就照你的想法修改吧！在運行Astro專案的期間，打開瀏覽器，就可以看到我們有了首頁以外的第一個頁面啦！

最後，你可以試著自己再新增一個頁面，當作你未來部落格內容的發文彙集，像是：src/pages/blog.astro或是src/pages/posts.astro

你可以自行練習，加入這個大多數部落格都會有的文章頁面，或是直接複製我放在下方的範例HTML，之後，我分享該如何編輯文章匯集的頁面。

```javascript
<body>
  <a href="/">首頁</a>
  <a href="/about/">關於我</a>
  <h1>文章</h1>
  <p>這裡是本站的文章匯集</p>
</body>

```

## 添加樣式

如果你不是新手，已經自有一套方法，就可以跳過以下的解說，但如果你才剛入門HTML與CSS，又剛接觸Astro框架，可以看看接下來要介紹的樣式添加方式。

樣式建構，是前端開發非常重要的一環。

每一位前端開發者都有自己習慣的實作方式，像我現在對Tailwind CSS愛不釋手。

我想幾乎每一位接觸過HTML與CSS的開發者，在初次嘗試CSS時，常規做法是另外寫一個.css檔案後，在HTML檔案中引入使用。

在Astro專案中，原則上也是這麼做，不過那是以全域樣式來說。

什麼是全域樣式呢？簡單來說，就是全部站通用的樣式，像是專案當中，重複使用的Button，它們在每個頁面的每一個地方，長相都一樣時，我們就會採用全域方式來定義它樣式，這樣一來，我只要在一個地方就可以修改全部的Button了！

而相對於全域的局部樣式來說，則是在.astro檔案中，直接使用<style>標籤來設定樣式。

### 局部樣式

就像這樣：

``` javascript
<body>
  <a href="/">首頁</a>
  <a href="/about/">關於我</a>
  <h1 class="title">文章</h1>
  <p>這裡是本站的文章匯集</p>
</body>

<style>
      .title {
        color: blue;
        font-size: 4rem;
      }
  </style>

```
### 全域樣式

你可以在路徑：src/styles/global.css，編寫好CSS樣式後，在你想使用的頁面中引入，或是在每個頁面都會套用的root layout中引入。

layout的做法之後會介紹。

以下的範例，為設定個別頁面樣式的做法：

```css
/* /src/styles/global.css */
.title {
        color: blue;
        font-size: 4rem;
      }

```

```javascript
---
import '../styles/global.css';
---

<body>
  <a href="/">首頁</a>
  <h1 class="title">關於我</h1>
  <p>這是本站「關於我」的頁面，這裡會放上自我介紹，以及建立本站的原由與初衷。</p>
</body>
```



## 在頁面中使用動態內容

上面有提到，在.astro檔案中的frontmatter部分，可以在這裡宣告JavaScript變數，並插入到下方的HTML區域當中，這就是利用變數來「動態」顯示內容的方法。

在瀏覽器的頁籤部分，會顯示這個頁面的 HTML title tag 的內容。

我們可以運用剛剛了解到的「新增動態內容」的方式，來改變Astro專案頁面的頁籤tittle，就像這樣：

```javascript
---
const pageTitle = "關於我";
---
<html lang="zh-Hant-TW">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{pageTitle}</title>
  </head>
  <body>
    <a href="/">首頁</a>
    <a href="/blog/">文章</a>
    <h1>關於我</h1>
    <p>這是本站「關於我」的頁面，這裡會放上自我介紹，以及建立本站的原由與初衷。</p>
  </body>
</html>
```

你可以先練習嘗試看看，未來我會分享如何利用Layout component的方式，套用在使用相同佈局的頁面，以盡可能符合DIY原則（Don't Repeat Yourself）。

## 開始發文

既然Astro框架的出現，是為了讓網站的內容更容易建立與呈現，它理所當然支援Markdown文件。

什麼是Markdown呢？它是一種輕量級的語法，讓你可以標示出內容的結構或是用途。

就像HTML也是一種標記語言，標記出網頁文本的結構與作用。由於Markdown的簡潔直觀，所以在撰寫內容上，尤其在開發者社群相當普及，再加上它容易上手的特色，Markdown語法也相當受到開發社群以外的創作者們青睞。

如果你對Markdown語法還不熟悉的話，可以參閱[Markdown語法大全](https://hackmd.io/@eMP9zQQ0Qt6I8Uqp2Vqy6w/SyiOheL5N/%2FBVqowKshRH246Q7UDyodFA "Markdown語法大全")。

或是自行Google Markdown語法的介紹，之後有機會筆者在發一篇分享，筆者常用的Markdown語法。

建立Markdown內容就跟你建立頁面一樣：src/pages/posts/post-1.md，接著就可以來撰寫內容：

```markdown
---
title: 我的第一篇文
author: Astro新手
description: "關於第一篇文章"
image:
    url: "https://example.com/assets/randomImg.webp"
    alt: "封面圖片"
pubDate: 2024-12-01
tags: ["astro", "部落格"]
---
在Astro專案中，加入第一篇內容
```

之後就可以在`http://localhost:4321/posts/post-1`上看到你的第一個部落格內容啦！

## 小結

這一回開始進入Astro專案的實作，以及初步認識Astro專案架構、基本語法、頁面建立，以及樣式設定。

如果是熟練JSX的前端開發者，想必可以無縫接軌Astro專案；而Astro盡可能使用HTML，減少非必要JavaScript邏輯的原則，也能讓開發新手快速進入狀況。

回想起那段在React文件中撞牆的日子，我突然覺得如果先從Astro開始，再來接觸JSX與React，或許就不用撞牆那麼多次、那麼大力⋯⋯哈哈，說不定是望著Astro的frontmatter說：「這啥鬼？」

總之，Astro官方的建立部落格教程相當淺顯易懂，非常推薦跟著官方的教程走一遍來認識Astro——這個內容建立工具，筆者的Astro系列文也是走過這個教程的心得分享。

如果真的對官方密密麻麻的原文文件感到不適應，那可以先跟著筆者的系列文，稍微熟悉Astro後，再去官方文件探索囉！

## 同場加映：Tailwind CSS

簡單介紹一下在Astro專案中，使用Tailwind CSS。

Astro已經將這個CSS框架，整合進去了，只要在終端機使用以下指令：

```
pnpm astro add tailwind
```

接著，在你的global.css中匯入：

```css
/* src/styles/global.css */
@import "tailwindcss";

```

最後，在專案的進入點，匯入global.css就可以使用囉！

```javascript
//src/layouts/Layout.astro
---
import "../styles/global.css";
---
```

詳情可以參閱官方文件：

> Astro官方：使用Tailwind CSS
> https://docs.astro.build/en/guides/styling/#tailwind

> Tailwind官方：在Astro專案中安裝Tailwind CSS
>https://tailwindcss.com/docs/installation/framework-guides/astro


## 參考資料：

> Astro 官網文件：
> https://docs.astro.build/en/getting-started/

> Astro 官網建立部落格教程：
> https://docs.astro.build/en/tutorial/0-introduction/