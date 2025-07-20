---
title: '用Astro無痛code出自己的部落格：動態路由'
author: 江森
description: 網頁開發者還在煩惱該怎麼建立自己的個人網站嗎？快來試試Astro，這款打造個人部落格／作品集的神器吧！
pubDate: 2025-03-08
image:
      url: "/astro-dynamic-routes.png"
      alt: 'cover picture'
tags: ["Front-end", "Astro", "Blog"]
draft: false
---

## 前言

上回我們初步使用了Astro的API來產生文章列表，這次我們將進一步深入Astro的API來建立另一個實用的功能：動態路由。

什麼是動態路由呢？

簡單來說就是，只要做好一些規則、條件的設定，之後只要符合條件就會自動生成路由頁面，而這類頁面通常都會有相同的結構與外觀。

在前端開發中，有的路由頁面不太可能一個一個手動設定，像常見的電商網站，網站的商品可能隨便都破千項以上，為每個商品頁面都製作一個靜態路由頁面，顯然這會讓開發者陷入加班地獄，而且都在處理低效又重複的工作。

更別說商品的數量是不斷更動的，如果你打算「純手動」維護那成千上萬的頁面，我內心浮現的畫面，是最近相當熱門的推石頭遊戲，這是一款讓玩家扮演薛弗西斯，推著石頭通過那滿是陷阱的路徑上山的遊戲，超M。

問題是遊戲會破關（那不是遊戲那是修煉），你那成千上萬的頁面路由維護，可沒有完結的一天。

除非你不幹了，或是業主發現這開發者真雷然後把你換掉，亦或者你終於想通，要採用動態路由。


## SSG頁面

跟電商網站類似，在部落格等內容網站中，文章頁面跟商品頁面一樣，數量龐大，而且頁面數量可能隨時變動，這就需要用到動態路由的技術來維護這類型的頁面。

我們先來製作標籤索引頁面，當使用者點擊文章內設置的標籤（tag）時，就被導航到包含該標籤所有文章的頁面。

就像是使用標籤做搜尋的動作。

跟上回一樣，這會使用到Astro的API來製作頁面。

首先建立標籤索引的頁面`src/pages/tags/[tag].astro`，你會看到`[名稱].astro`這樣的檔案，`[]`內的名稱就是預先設定的參數，這告訴Astro：這個頁面會使用動態路由生成，並且會採用SSG模式。

SSG又是什麼？怎麼突然出現了一個感覺很酷炫，但又搞不懂在幹嘛的術語？

SSG靜態頁面生成Static Site Generation的簡稱，這是一種頁面渲染的方式，採用SSG的頁面會在建置階段(build-time)生成。

由於我們設定了動態路由，所以負責渲染頁面的伺服器，會在建置階段(build-time)，依據內部定義的函式（接下來會實作），來產生頁面。

生成我知道，但為什麼是靜態？建置階段(build-time)又是怎麼回事？

所謂建置階段(build-time)就是程式碼轉換成瀏覽器可以讀懂的格式，也就是HTML、CSS、JavaScript。

拿我們正在進行的Astro專案來說，我們所寫的程式碼都是astro框架的格式，所以當要給瀏覽器運行時，要在建置階段進行轉換。

而靜態代表雖然動態路由的頁面是動態生成，但是頁面會在建置階段(build-time)決定好，不需要外部輸入的資料。

因為產生頁面所需要的資料，全都在專案裡面了，只是我們需要透過一些方法去取得。

這又是什麼意思呢？這就要提到另一種渲染方式：SSR伺服器端渲染。

跟SSG一樣，SSR也是負責渲染的伺服器要製作出頁面。

不同的地方在於，SSR會根據外部輸入，例如使用者的狀態與互動、資料庫變動等等，來產生客製化的頁面。

例如常見的會員頁面，會根據登入的使用者不同，而顯示不同的使用者頁面；或是股票資訊的網站，使用者會希望能在頁面看到每秒幾十萬上下的股市波動；又或者一些大型電商網站，它商品的數量變動頻率很高，需要即時顯示庫存好方便顧客下單等等。

所以跟SSR比起來，SSG則相對「靜態」，因為它在頁面產生前的建置階段(build-time)，就已經確定好頁面的模樣了。

我們已經初步了解頁面的渲染方式，那麼該如何讓動態路由知道，該拿什麼資料來產生頁面呢？

## 使用Astro的API動態產生路由

回到`src/pages/tags/[tag].astro`的檔案，我們可以利用Astro當中的`getStaticPaths()`這支函式，讓這個動態路由知道，有接觸過Next.js的讀者，應該對這支函式不陌生。

至於該怎麼去抓取生成頁面所需的資料，就像這樣：

```javascript
// src/pages/tags/[tag].astro
---
import MainLayout from '../../layouts/MainLayout.astro';
// 定義要給SSG使用的路由參數
export function getStaticPaths() {
  return [
    { params: { tag: "標籤1" }},
    { params: { tag: "tag2" }},
    { params: { tag: "這是標籤3" }},
  ];
}

// 抓取動態路由參數
const { tag } = Astro.params;
---
<MainLayout pageTitle={tag}>
  <div>標籤可以自定義，像這樣：{tag}</div>
</MainLayout>
```

比較特別的地方是，這支函式在定義完後就直接匯出（export），而不是在定義的檔案內呼叫它。

這樣就可以告訴Astro產生`標籤1.astro`、`tag2.astro`、`這是標籤3.astro`的頁面檔案，以及生成：`/tags/標籤1`、`/tags/tag2`、`/tags/這是標籤3`三個路由。

但要注意一點，以上的示範是為了幫助理解，千萬別在路由的參數內使用中文字，因為`getStaticPaths()`函式回傳陣列中的`params`物件，會成為URL的子路由，在URL使用中文字可是會出現亂碼，所以實務上可別這麼做！

還有，動態路由填入的參數，會區分大小寫，如果使用相同的字串，大寫跟小寫會被視為不同的路由。

回到上面的範例，眼尖的你們應該有發現，上面的tag參數，是直接定義好在`getStaticPaths()`內部的。

這麼一來，每次文章的標籤種類有更動時，都必須回到這裡調整程式碼，這樣的動態路由，好像都是開發者「自己手動」，而不是程式邏輯自動調整更動？

別急，這時候上回使用的`import.meta.glob()`再次登場！

我們同樣先抓取全部的文章：


```javascript
// src/pages/tags/[tag].astro
---
import MainLayout from '../../layouts/MainLayout.astro';

export function getStaticPaths() {
//在這裡新增
 const allPosts = Object.values(import.meta.glob('../posts/*.md', { eager: true }));

}

const { tag } = Astro.params;
---

<MainLayout pageTitle={tag}>
  <div>{tag}</div>
</MainLayout>
```

再來取出文章中的標籤：

```javascript
// src/pages/tags/[tag].astro
---
import MainLayout from '../../layouts/MainLayout.astro';

export function getStaticPaths() {
 const allPosts = Object.values(import.meta.glob('../posts/*.md', { eager: true }));
//在不重複的前提下，取得所有文章的所有標籤
 const uniqueTags = [...new Set(allPosts.map((post: any) => post.frontmatter.tags).flat())];

}

const { tag } = Astro.params;
---

<MainLayout pageTitle={tag}>
  <div>{tag}</div>
</MainLayout>
```

最後，由於`getStaticPaths()`函式必須回傳陣列，這個陣列內的元素為物件，物件內必須是要給動態路由使用的參數，但這一次，我們希望不只有路由參數，還希望能包含同樣標籤的全部文章。

稍微解釋一下`const uniqueTags = [...new Set(allPosts.map((post: any) => post.frontmatter.tags).flat())]`這段在做什麼：

首先，`new Set()`會創建一個set物件，它會檢查傳入物件的值，並且把重複的值移除，保留唯一的值。

在上面的例子中，`allPosts.map((post: any) => post.frontmatter.tags)`會回傳所有文章的tags陣列，也就是說陣列內的元素，其實是各個文章的全部標籤所組成的陣列，感覺像在繞口令，拿我們的Markdown範例來說，其實就是長這樣：

```javascript
[
  [ 'astro', 'blog', 'first'],
  [ 'astro', 'blog', 'second' ],
  [ 'astro', 'blog', 'third' ]
]
```

這是個二維陣列，也就是陣列裡面還有一個陣列。

接著使用JavaScript原生的`.flat()`方法，這個陣列方法，會將陣列扁平化，就如同字面上的意思，它把陣列壓扁。

當陣列裡面的元素包含陣列時，就把內部的陣列元素拆出來，如果沒有指定參數，就像我們的例子，這個方法就會只拆掉一層，於是原本的二維陣列就會變成這樣：

```javascript
[
      'astro',
      'blog',
      'first',
      'astro',
      'blog',
      'second',
      'astro',
      'blog',
      'third'
]
```

再來使用`new Set()`把陣列中重複的元素排除掉，由於它會生成set物件，我們使用展開運算子把它轉變成陣列。

這就是`const uniqueTags = [...new Set(allPosts.map((post: any) => post.frontmatter.tags).flat())]`運作的過程。

搞定之後，我們可以將得到的`uniqueTags`進一步處理，讓它回傳帶有tag參數的陣列：

```javascript
// src/pages/tags/[tag].astro
---
import MainLayout from '../../layouts/MainLayout.astro';

export function getStaticPaths() {
 const allPosts = Object.values(import.meta.glob('../posts/*.md', { eager: true }));
 const uniqueTags = [...new Set(allPosts.map((post: any) => post.frontmatter.tags).flat())];

//回傳含有參數tag的陣列
  return uniqueTags.map((tag) => {
    return {
      params: { tag },
    };
  });
}

const { tag } = Astro.params;
---

<MainLayout pageTitle={tag}>
  <h3>{tag}</h3>
</MainLayout>
```

我們可以把透過標籤找出的文章設定成傳送門，讓使用者可以找到他想用標籤尋找的文章內容：

```javascript
// src/pages/tags/[tag].astro
---
import MainLayout from '../../layouts/MainLayout.astro';

export function getStaticPaths() {
 const allPosts = Object.values(import.meta.glob('../posts/*.md', { eager: true }));
 const uniqueTags = [...new Set(allPosts.map((post: any) => post.frontmatter.tags).flat())];

//回傳陣列，需要有給動態路由使用的參數，以及含有該標籤的全部文章
  return uniqueTags.map((tag) => {
    const filteredPosts = allPosts.filter((post: any) => post.frontmatter.tags.includes(tag));
    return {
      params: { tag },
      props: { posts: filteredPosts },
    };
  });
}

const { tag } = Astro.params;
//取用篩選後的文章資料
const { posts } = Astro.props;
---

<MainLayout pageTitle={tag}>
  <h3>{tag}</h3>
  <ul>
    {posts.map((post: any) => <li><a href={post.url}>{post.frontmatter.title}</a></li>)}
  </ul>
</MainLayout>
```

雖然我們有了標籤索引頁面，但是目前沒有一個地方，可以讓使用者逐一查看全部的標籤，進而透過標籤查找內容。

所以接下來要做個匯集所有標籤的區塊，並且把這個區塊放到文章頁面。

我們在上回就已經建立過文章頁面，並且完成了文章列表：

```javascript
// src/pages/posts/index.astro
---
import MainLayout from '../../layouts/MainLayout.astro'
const allPosts = Object.values(import.meta.glob('./*.md', { eager: true }));
---

<MainLayout pageTitle="文章">
	<section>
      <h2>文章列表</h2>
      <ul class="post-list">
      {allPosts.map((post: any) => (
            <li class="list-item">
            <a href={post.url}>{post.frontmatter.title}</a>
            </li>
      )
      )}
      </ul>
	</section>
</MainLayout>

<style>
	section {
		padding: 0 3rem;
	}
	.post-list {
		padding: 0.25rem 1.5rem;
		font-size: 1.25rem;
	}
	.list-item {
		margin-bottom: 2rem;
	}
</style>
```

我們可以插入剛剛才使用過，還熱騰騰的`const uniqueTags = [...new Set(allPosts.map((post: any) => post.frontmatter.tags).flat())]`，來幫我們抓出全部的標籤。

然而這一次沒有要生成動態路由了，而是生成全部標籤的連結，用來導向各個標籤的索引頁面：

```javascript
// src/pages/posts/index.astro
---
import MainLayout from '../../layouts/MainLayout.astro'
const allPosts = Object.values(import.meta.glob('./*.md', { eager: true }));
const tags = [...new Set(allPosts.map((post: any) => post.frontmatter.tags).flat())];
---

<MainLayout pageTitle="文章">
	<div>
            <section>
                  <h3>標籤</h3>
                        <div>
                              {tags.map((tag) => <a href={`/tags/${tag}`}>{tag}</a>)}
                        </div>
            </section>
		<section>
			<h3>文章列表</h3>
			<ul class="post-list">
			      {allPosts.map((post: any) => <li class="list-item"><a href={post.url}>{post.frontmatter.title}</a></li>)}
  		      </ul>
		</section>
	</div>
</MainLayout>

<style>
	section {
		padding: 0 3rem;
	}
	.post-list {
		padding: 0.25rem 1.5rem;
		font-size: 1.25rem;
	}
	.list-item {
		margin-bottom: 2rem;
	}
</style>
```

由於頁面加入了新的區塊，筆者有稍微做調整，區分出頁面元素之間的層級，並且做了一些樣式上的調整：

```astro
// src/pages/posts/index.astro
---
import MainLayout from '../../layouts/MainLayout.astro'
const allPosts = Object.values(import.meta.glob('./*.md', { eager: true }));
const tags = [...new Set(allPosts.map((post: any) => post.frontmatter.tags).flat())];
---

<MainLayout pageTitle="文章">
	<div>
		<section>
			<h3>標籤</h3>
			<div class="tags-link-container">
				{tags.map((tag) => <a href={`/tags/${tag}`}>{tag}</a>)}
			</div>
		</section>
		<section>
			<h3>文章列表</h3>
			<ul class="post-list">
				{allPosts.map((post: any) => <li class="list-item"><a href={post.url}>{post.frontmatter.title}</a></li>)}
  		</ul>
		</section>
	</div>
</MainLayout>

<style>
	section {
		padding: 1rem 2rem;
		margin: 1.5rem;
		background-color: rgba(186, 207, 199, 0.3);
	}
	.post-list {
		padding: 0.25rem 1.5rem;
		font-size: 1.25rem;
	}
	.list-item {
		margin-bottom: 2rem;
	}
	.tags-link-container {
		padding: 0.25rem 1.5rem;
		font-size: 1.25rem;
		display: flex;
		flex-wrap: wrap;
		gap: 3rem;
	}
</style>
```

大功告成啦！這是我們現階段頁面的模樣：

![新增標籤動態路由](/astro-tag.png)

### 結語

這回我們了解了SSG的概念，並初步運用了動態路由。

這讓我們在維護某些頻繁更動的頁面時，不需要一個一個手動進行，只要在一個地方做好設定，動態路由就會幫我們自動搞定全部的頁面，大大節省了時間與心力，這也讓我們看到了程式自動化的魅力。