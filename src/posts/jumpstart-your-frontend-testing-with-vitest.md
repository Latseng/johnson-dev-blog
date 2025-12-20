---
title: "從Vitest開始的前端測試"
pubDate: 2025-06-04
description: "在React中使用Vitest撰寫測試"
author: 江森
image:
  url: "vitest_e7dr90"
  alt: "Cover Picture"
tags: ["Front-end", "Test", "Vitest"]
draft: false
---

## 前言

身為開發者，你在撰寫完程式碼，修正或開發了某個功能之後，一定會進行測試這個動作，確保你的產出有符合預期。

但為了測試你做的功能沒問題，開發者手動把程式跑起來，實際操作一遍，確認這個過程功能的運作，這不僅繁瑣，當專案規模開始增長，開發者要維護的程式碼越來越大包，功能也開始變多、變複雜時，「純手工」這種測試功能的方式，也會變得相當棘手，甚至不切實際。

像在前端，每完成一部分UI、一個函式或功能時，都要開瀏覽器看一下畫面，跑一遍流程，在專案剛開始時，可能還不覺得這有什麼問題。

但是當UI開始變複雜、功能逐步上線之後，要手動測試每個功能，以及相應的使用者流程，就會是個惡夢的開始。

尤其是在你的產品中，不同的使用者會有不同的身份與狀態時，每個狀態都要測試相對應的功能是否正常運作，這可能會遠比你的開發工作，還來得要費時與搞剛。

而且人不是機器，純手工測試難免會發生疏漏，這讓人工測試在規模較大、或是進行到後期的複雜專案，變得不可行。

因此對於希望確保開發的品質，但是又不想讓測試，成為讓開發者崩潰的另一個大麻煩，「自動化測試」就是讓測試變得可行、可靠又可控的技術。

雖然這是一套需要額外花時間學習與建置的技術，但是有了自動化測試，不但開發者能夠更輕鬆地完成測試任務，對於維護的程式碼也能有更高的掌握度，當未來需要重構、修改程式碼時，也能更快、更有效地完成。

## 前端測試

前言忍不住落落長了一段，因為筆者在還沒接觸自動化測試之前曾經痛過😭

所以我們已經知道自動化測試「真香」啊～那麼該怎麼進行前端的自動化測試呢？

首先我們要先知道，前端測試是有分種類的，根據適用情況與測試的層級主要分成：

- **靜態分析**：TypeScript或ESLinet的靜態分析或是型別檢查，不用執行程式就能幫助開發者在開發階段，發現程式碼存在異常。
- **單元測試(Unit testing)**：最小單位的測試，像是單個模組或函式功能測試。
- **整合測試(Integration testing)**：函式或是模組串連運作的功能測試。
- **端對端測試(End-to-end testing)**：模擬使用者操作流程的測試。
- **視覺測試(Visaul testing)**：如同名稱，測試UI瀏覽器上的顯示，並加入跨瀏覽器、RWD等變因來確認渲染是否如預期。

每個測試都有它專攻的情境，像是單元測試，它是最基礎且測試範圍最小的測試，專門針對某個函式或單一模組，測試它的執行情況。

從整合測試開始，測試的情境會從單一功能檢視，來到函式或模組功能彼此串聯運作的層級。

至於端對端測試，會模擬使用者的操作流程，檢視的層級又再高一層，範圍也更廣。

雖然整合測試與端對端測試的情境，層級越高會越接近程式運作的實際情況，但相對地，當測試出問題時，反而不如單元測試容易鎖定癥結點，而且單元測試的撰寫與執行成本也相對較低，因此我們就從單元測試開始吧！

## 什麼是Vitest

Vitest是Vite原生的測試框架，除了無痛與Vite整合外，還與Jest這個老牌測試工具高度相容。

我想許多前端開發者對於Vite這個工具應該都不陌生，尤其在今年初，React開發團隊[宣布棄用create create app](https://react.dev/blog/2025/02/14/sunsetting-create-react-app)後，除了使用像是Next.js、Nust.js等，完整度更高的解決方案外，Vite應該會是初始化前端專案的首選。

對前端開發者來說，Vite的一大特點就是：快！

Vitest也繼承了這一點，官方更是直接在首頁昭告天下：A Vite-native testing framework. It's fast!

筆者展開React專案也幾乎都是使用Vite建置，所以本次的初回前端測試介紹，就從Vitest開始吧！

## 開始使用Vitest

1. 使用Vite建立一個React專案
2. 安裝vitest以及相關套件
```
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```
安裝套件簡介：

- `--save-dev`：表示這個套件只在開發環境安裝，生產環境不會用上
- `vitest`: 測試框架，本回的主角
- `@testing-library/react`: 測試React元件用的函式庫
- `@testing-library/jest-dom`:擴展 Jest (或任何兼容 Jest 的測試運行器，如 Vitest) 斷言功能的函式庫，它提供了一系列額外的、更語義化且更易讀的匹配器 (matchers)，用於測試 DOM (Document Object Model) 元素。匹配器讓你能夠更直接描述對 DOM 狀態的預期。
- `@testing-library/user-event`: 模擬使用者與DOM互動的工具
- `jsdom`：jsdom是一個使用JavaScript實現DOM的模擬，讓你可以在Node.js環境中模擬瀏覽器環境來測試React元件。

3. Vitest設置
在vite.config.ts檔案中，加入以下設定：

```js
import { defineConfig } from 'vite/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
});
```

- **environment**：使用`jsdom`模擬瀏覽器環境來進行測試。
- `globals: true`讓vitest的API像是：`describe`, `it`, `expect` 可以在全域使用，而不需要另外import。
- `setupFiles`: 設定測試相關配置的檔案，類似Jest的 `setupFilesAfterEnv`.

4. 建立`Setup`檔案：
在`src`資料夾內，新增一個檔案，命名為：setupTests.ts，並加入以下內容：

```typescript
import '@testing-library/jest-dom/vitest'; // 匯入 @testing-library/jest-dom 的 matcher 
import { cleanup } from '@testing-library/react'; import { afterEach } from 'vitest'; 

// 在每個測試結束後清理 DOM，防止測試之間的狀態互相影響 
afterEach(() => { 
  cleanup(); 
});
```
此設定將自動在你的測試中，納入 jest-dom 提供的自訂匹配器。

`afterEach(() => { 
  cleanup(); 
})`這個函式，本回先對它有個印象就好。

當測試變得複雜，相依性提升時，我們會需要使用這類API，來將每個測試隔離，或是像上面那樣做「歸零」的動作，確保每次測試都在開發者控制的範圍內，沒有變因污染。本回沒有要介紹這個概念，未來有機會再提，所以先看過有個印象就好。

5. 在package.json中加入測試運行腳本：
```json
// package.json

{ "name": "my-react-app", 
// ... 其他配置
"scripts": { 
  "test": "vitest", // 新增這一行 
  "test:watch": "vitest --watch", // 可選：監測模式，在檔案變更時自動運行測試  
  }, 
  // ... 其他依賴
}

```

## 在測試開始前你需要先認識的夥伴

在開始寫測試前，先認識幾個出場率相當高的夥伴，它們也是Vitest提供的API語法，由於高度相容於Jest，所以你也會在Jest中看到它們，首先是：

1. **describe**：

describe是個函式，它的第一個參數放的是字串，字串內則是開發者自定義的測試群組描述。

對，就跟它字面上一樣，它的作用是讓開發者描述，你這組測試是打算要測什麼？

它的第二個參數則是個函式，讓你可以放入多組相關測試，就像這樣：

```js
describe('放入測試名稱：敘述你打算做哪些一系列的相關測試？', () => {
  // 測試的內容
  // 可以放入多個test()函式，等下會介紹
})

```

它可以放入多個測試，你可以把describe想像成是一個資料夾，裡面會放關於某項特定功能或模組的所有測試，就像等下要介紹的test。

就跟註解一樣，描述寫得清楚，撰寫的測試程式碼才容易判讀。

2. **test**：

它也是個函式，從名稱可以看得出來，`test()`是測試邏輯的核心，有時候你會看到它被寫成`it()`，但為了讓初學者容易辨別，本文一律寫成`test()`，你在其他測試案例看到`it()`的話，要記得它就是測試邏輯的核心：等同於test函式。

就跟`describe`一樣，它的第一個參數也是字串，讓開發者可以描述這支測試的名稱，要清楚地描述這個測試所驗證的具體行為。常會以「should」開頭，像是「should return true for valid input」

每個`test()`都定義了一個單獨、可執行的測試。它會驗證你的程式碼片段的具體行為，就像這樣：

```js
it('測試名稱', () => {
  // 測試內容
})
```

3. **expect**：

就像字面上的意思，expect預期測試的結果。

我們要進行測試，就需要先設定預期的結果。（沒設定預期的話也不用測了，代表你寫的程式，是個結果怎麼樣都可以的佛系code）

expect就是個用來斷言的函式，所謂斷言(Assertion)在軟體測試中，用來驗證程式碼的執行結果是否與預期結果相同。

它就像是你對程式碼說：「當這段程式碼運行完畢後，我預期會發生這件事，或者這個值會變成這樣。」

如果斷言的條件為True，即符合預期，代表測試通過。

如果斷言的條件為False，即不符合預期，則測試失敗，會拋出錯誤，並標示出錯的位置。

先登場的兩位夥伴，跟expect組合起來就會長這樣：

```js

// 匯入或者定義要測試的程式碼
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }

// describe: 測試群組，會放入相關的測試
describe('Calculator Functionality（計算功能）', () => {
  // test或是it: 每個單獨的測試案例，描述要驗證的具體行為
  test('should correctly add two numbers', () => {
    const result = add(2, 3); // 執行被測試的程式碼
    // expect: 斷言，驗證實際結果是否符合預期
    expect(result).toBe(5); // 斷言：結果應該是5
  });

  test('should correctly subtract two numbers', () => {
    const result = subtract(10, 4);   
    expect(result).toBe(6); // 斷言：結果應為6
   });
});

```
認識了以上三位，相當常在測試中出場的夥伴後，接下來我們就要開始在React中寫測試啦～

## 開始在React Component中撰寫測試

### 測試FC

在初步完成了Vitest的相關設定，以及稍微介紹測試的基本形式之後，接下來我們要在常見的React Component中寫一段簡單的測試：

```jsx
// src/components/Button.tsx

type ButtonProps = {
  label: string;
  onClick: () => void;
};

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
};

export default Button;
```

以上是一個常見的按鈕元件，我們來為這個元件寫一段測試如下：

```jsx
// src/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button Component', () => {
  test('Should render the button with the correct label', () => {
    render(<Button label="Click Me" onClick={() => {}} />);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  test('Should call the onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button label="Click Me" onClick={handleClick} />);
    await userEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```
- `render`: 渲染測試用的元件
- `screen`: 查詢渲染完成的DOM
- `userEvent.click`: 模擬按鈕的點擊事件
- `vi.fn()`: 模擬一個函式來追蹤其呼叫

接著執行測試，使用以下指令：
```
npx vitest
```
或是

```
npm run test
```

這段指令會執行所有預設的`*.test.tsx` 或 `*.spec.tsx`檔案。或是可以使用以下方式在監視模式下執行測試：
```
npx vitest --watch
```

或是

```
npm run test:watch
```

執行後，Vitest會使用監測模式，當程式碼改動就會觸發測試執行。

### 測試Hook與自訂函式

Vitest也可以用來測試自定義的Hook與函式，就像這樣：

```jsx
// src/hooks/useCounter.ts
import { useState } from 'react';

export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);

  return { count, increment, decrement };
}
```
如同一般的unit test，先匯入後再開始測試這支我們自定義的Hook，是否如預期執行。
```jsx
// src/hooks/useCounter.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useCounter } from './useCounter';

describe('useCounter Hook', () => {
  test('Should initialize with the correct value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  test('Should increments the counter', () => {
    const { result } = renderHook(() => useCounter());
    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);
  });

  test('Should decrements the counter', () => {
    const { result } = renderHook(() => useCounter(10));
    act(() => {
      result.current.decrement();
    });
    expect(result.current.count).toBe(9);
  });
});
```
- `renderHook`: 在測試環境中掛載React hook 
- `act`: 操作更新狀態，確保在斷言前，更新與副作用已經執行完畢。

## 結語

自動化測試是個好東西（真香！）。

我可以理解為何這項工具，坊間許多課程只有稍微提及，或是放到非常後面的進度，因為撰寫測試不會立即產出功能，而是對功能的確保與檢查，理解這個工具也需要一定的學習成本與門檻。

但筆者認為自動化測試是一個相當重要的觀念，讓開發者將品質與成果當成目標，而不只是完成code而已，更幫助開發者免去了費時又費力的「純手工」測試。

而且不論是在開發前先擬定好測試的：**測試驅動開發 (Test-driven development)**，或是完成功能後才回頭撰寫測試，都能幫助開發者進一步釐清自己開發的思路，更加穩固自己的產出品質，真的是一兼二顧，摸蜊仔兼洗褲。

本回介紹的Vitest更是個相當好入門的前端測試的框架，尤其在許多前端開發者會選擇使用Vite建置專案的情況下，雖然提到前端測試大多會想到從Jest開始，但考慮到Vite的整合以及與Jest的高度相容，何不嘗試從Vitest開始寫測試呢？