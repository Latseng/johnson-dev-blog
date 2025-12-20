---
title: 'Giscus：讓開發者無痛在網站中加入留言功能'
author: 江森
description: 'Giscus，基於Github討論功能的擴充外掛'
pubDate: 2025-03-11
image:
      url: 'comment-test_gxgxqa'
      alt: 'cover picture'
tags: ["Front-end"]
draft: false
---
## 前言

之前筆者介紹了架站神器Astro框架，並分享了一系列的[操作心得](https://johnson-dev.netlify.app/tags/astro/)~~推坑文~~。

只要是使用JavaScript開發者，都能很輕易的上手這個框架，並快速架設一個靜態內容網站。

這讓想親手coding自己的網站，但又不想搞得太複雜的開發者，Astro是一個相當推薦的方式。

但好不容易有了一個自己的部落格，開開心心地上傳內容，但總覺得少了什麼⋯⋯

對了！就是留言功能！

個人部落格，除了是自己耕耘的小天地，總會希望自己的成果可以有跟外界互動、交流的機會，而不是唱獨角，關起門來自High。

因此為自己部落格設置一個專屬的留言功能，想必會列在開發者自建部落格網站的待辦清單上。

所以這一次就要來分享該如何在自己開發的網站上快速加入留言功能。

## Giscus介紹

當然實現留言系統可以有很多種方式，如果以開發者的角度，第一時間可能會想到建資料庫、設計API然後再整合串接到自己的網站裡。

但對於規模不大的個人部落格來說，上述的方法好像有點過頭。

這就像我只是想吃個宵夜，可能泡個泡麵就解決了，可是卻要用上宴會辦桌的陣仗來處理。

就在我煩惱是不是該硬著頭皮~~辦桌~~，來解決這個~~宵夜等級的~~問題時，我發現到了Giscus這個工具！

[Giscus](https://giscus.app/zh-TW)是一個開源工具，藉由在你的Github安裝擴充外掛，並連結到你專案repo的discussion，來實現留言功能。

## 在Astro專案中加入留言功能

先到這個頁面安裝giscus：https://github.com/apps/giscus

由於筆者已經安裝過了，所以畫面是這樣：

![giscus-install](/giscus-install.png "giscus install")

筆者是授權giscus存取我所選的repo，也就是部落格的repo。

之後來到在你Github的專案repo，進入setting的頁面：

![repo-setting](/repo-setting.png "repo setting")

往下找到Features的區塊，在其中的Discussions選項打勾：

![repo-setting-features-discussions](/repo-setting-features-discussions.png "repo setting features discussions")

最後回到[Giscus](https://giscus.app/zh-TW)的網站，在下方的設定區塊中的儲存庫輸入欄位，填入你的repo的URL，之後照著設定的說明操作即可。

你可以參考筆者的設定：

![giscus-setting-1](/giscus-setting-1.png "giscus setting 1")
![giscus-setting-2](/giscus-setting-2.png "giscus setting 2")
![giscus-setting-3](/giscus-setting-3.png "giscus setting 3")
![giscus-setting-4](/giscus-setting-4.png "giscus setting 4")

最後會產生一組HTML的script標籤。

由於我使用Astro框架，情況會比較單純一些，直接複製完成的script標籤到astro專案，建立一個component並貼上這組標籤後，在文章頁面的.astro檔案中引入這個component即可。

```astro
// src/components/PostComments.astro
---

---
<script src="https://giscus.app/client.js"
        data-repo="Latseng/johnson-dev-blog"
        data-repo-id="R_kgDONagaug"
        data-category="Announcements"
        data-category-id="DIC_kwDONagaus4Cnz8_"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="transparent_dark"
        data-lang="zh-TW"
        crossorigin="anonymous"
        async>
</script>
```

```astro
// src/layouts/PostLayout.astro
---
import PostComments from "@components/PostComments.astro";
---
<article>
 <slot />
 <PostComments />
</article>
```

完成後的模樣就像下方的留言區。

如果你是使用React或其他框架，可以查看[giscus-component](https://github.com/giscus/giscus-component)中的說明，或是參考Eason Chang大大在Next.js部落格專案中的做法：<https://easonchang.com/zh-TW/posts/giscus-comment-system>


## 參考資料
>[Giscus](https://giscus.app/zh-TW)

>[Youssouf: Add comments Section to your Astro blog](https://easonchang.com/zh-TW/posts/giscus-comment-system)

>[Eason Chang: 使用 giscus 在 Next.js 加入留言系統](https://easonchang.com/zh-TW/posts/giscus-comment-system)