---
title: "用Astro無痛code出自己的部落格：安裝"
pubDate: 2024-12-15
description: "網頁開發者還在煩惱該怎麼建立自己的個人網站嗎？快來試試Astro，這款打造個人部落格／作品集的神器吧！"
author: 江森
image:
  url: "/start-building-your-web-with-astro.jpg"
  alt: "Cover Picture"
tags: ["Front-end", "Astro", "Blog"]
---
## 前言
筆者在[上一回](/posts/start-building-your-blog-with-astro/)推坑並介紹了Astro——這個專攻內容呈現為主的網站架設框架。

而Astro的官方文件也相當清楚易懂，更棒的是，官網文件的入門指南，還提供了一個從0開始打造部落格的新手教程：

[Build your first Astro Blog](https://docs.astro.build/en/tutorial/0-introduction/)

如果你想跟著官方的教程走一遍，可以點擊上面的連結。

如果你想了解筆者踩坑歷程，我會盡可能簡潔、詳實地分享，建立Astro部落格的過程，還有踩過的坑。

接下來，跟著筆者進行以下的操作過程，實際動手玩玩看吧！

## 安裝過程

繼續上一回的安裝指令：
```
npm create astro@latest
```
接著就會來到這個畫面

![Astro開始安裝](/Astro-start-install.png)

Where should we create your new project?

就取你喜歡的專案資料夾名稱，因為這篇是介紹Astro，所以我就取blog-example。

再來是How would you like to start your new project?（你想要如何開始你的新專案？）

先介紹第二個選項，這是從Astro提供的blog template開始建構你的專案，如果你不想從0開始摸索，或是想觀摩官方的模板，可以選擇這個選項。

而在官方Resources中的theme：[Astro theme](https://astro.build/themes/)，這是個官方提供平台，讓各路大神可以在這裡上傳自己製作的主題，你可以在這裡選用主題模板來開始你的專案。

這些模板有免費也有付費的，你也可以在這裡上傳自己做的模板，幫助他人降低從0開始的門檻。

第三個選項則是Astro的文件模板，身為資訊工程師，在使用各類技術工具時，查閱官方文件是必經的過程。

這個模板就是協助你建立這樣一個文件網頁的專用工具。

你可以去看看Astro的文件網站範例：[Starlight](https://starlight.astro.build/)。

由於本篇打算從0開始介紹，所以選第一個選項： A basic, minimal starter。

接下來的安裝選項，就是一些常見的設定：是否安裝依賴套件、是否初始化git repository。

如果你沒有要做額外的客製，就選建議的Yes，完成我們的Astro專案安裝吧！

![Astro安裝完成](/Astro-installed.png)

在安裝過程中，會有一個可愛的Astro機器人，陪你完成生硬的CLI安裝指令😂

## 專案資料夾架構

安裝完成的Astro專案，它的資料夾架構大概是長這樣：

![Astro專案資料夾架構](/Astro-folders.png)

隨著改版更新，這個架構可能會有些微差異，不過應該主要的架構層級應該差不了多少，這篇文完成當下，適逢Astro剛發佈的5.0版本更新，這篇也是使用官方更新的穩定版本。

如果你使用不同的版本，可以到官方文件去查閱版本間的更新差異。

我們主要的動工區域，是在src資料夾。

看到pages就知道這個資料是存放頁面相關的檔案，我們可以看到astro專案的.astro檔案。

layouts讓你可以將主要的頁面佈局配置抽取出來，放到這個專用資料夾管理，而components是存放UI元件，assets則是放你的多媒體資源，像是圖片之類的檔案，畢竟部落格發文總少布了圖片、影音等多媒體資源的搭配。

最後，使用使令：
```
npm run dev
```
由於Astro專案預設運行在http://localhost:4321/上

開啟瀏覽器，進入運行的位址，就能看到我們準備動工的專案初始畫面囉！

## 參考資料：

> Astro 官網文件：
> https://docs.astro.build/en/getting-started/

> Astro 官網部落格教程：
> https://docs.astro.build/en/tutorial/0-introduction/