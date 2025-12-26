---
title: "Python 的型別提示 Type Hint"
author: 江森
description: "Python 如何把關資料的出入？"
pubDate: 2025-12-22
image:
  url: "pydantic-gatekeeper_y23te4"
  alt: "cover picture"
tags: ["Python"]
draft: false
---

## Type Hint 是什麼？

型別提示（Type Hint）是 Python 從 3.5 版本開始所引入的一項功能，它讓開發者可以在程式碼中「標註」變數、函式參數以及回傳值的資料型別。

如果有使用過靜態語言的開發者，或是像筆者一樣有在寫 TypeScript，那對這種語法應該不陌生。

Python 是動態型別的程式語言，動態的意思是，程式碼中的變數型別可能會一直變動，開發者不需要在宣告變數時指定資料型別，並且在定義完之後也能夠更改變數的型別。

這樣看起來彈性，但常會導致以下問題：

- 程式碼可讀性降低： 在沒有型別提示的情況下，跟你合作的開發者（或未來的你自己）可能難以理解函式會接收什麼樣的參數型別，或者會傳回什麼型別的值。

- 除錯困難： 型別不匹配的錯誤只會在執行時會發生，而且不容易除錯。

雖然這麼說，但其實型別提示並沒有強制性，即便你在 Python 的程式碼中標上型別提示，也不會執行靜態分析（運行程式碼之前，自動偵測出型別不匹配之處）。

所以僅有型別提示，嚴格來說只會帶來可讀性以及易於除錯，但除此之外，還是有一些優點，像是 IDE 的自動補齊以及錯誤提示功能上，如果你有確實加上型別提示，這些提示功能會更精準。

而且當你打算引入靜態型別檢查工具（例如 mypy、pyright）時，Python 就可以變得像 TypeScript 一樣，在程式碼執行前執行靜態分析，在開發的早期就發現潛在的型別問題。

之後會提到的 Pydantic 也是以型別提示為基礎來進行資料驗證。

型別提示的使用方式如下（範例取自 [FastAPI 官網](https://fastapi.tiangolo.com/python-types/#add-types)）：

```python
def get_full_name(first_name: str, last_name: str):
    full_name = first_name.title() + " " + last_name.title()
    return full_name

print(get_full_name("john", "doe"))
```
以上程式碼是在函式的引數中，定義引數的型別。這樣看來感覺型別提示有點囉唆，似乎放棄了 Python 動態語言的靈活與彈性，但這種取捨，會帶來了靜態語言的嚴謹性，讓你的程式碼的可維護性大幅提升，除錯不會除到眼花（雖然這年頭人工除錯的機會越來越少了）。

## 帶有類型參數的泛型類型

有些資料結構可以包含其他類型的資料，例如 Python 當中的 List, Tuple, Set, Dict 這類。

其中，List, Tuple, Set 的情況相當單純：
```python
def process_items(items: list[str]):
    for item in items:
        print(item)
        
def process_items(items: tuple[int, int, str]):
    for item in items:
        print(item)
        
def process_items(items: set[bytes]):
    for item in items:
        print(item)
```

要特別注意的是，由於 Tuple 的特性：變數宣告後，Tuple 的內部元素不管是數量、順序或是個別元素本身都不能再更動，所以 Tuple 內部元素的資料類型就必須一次宣告完畢。

這是與內部元素會變動的 List 與 Set 不太一樣的地方。

## 聯合型別 Union

### 多種資料輸入

有些變數可能會需要多個種類的資料輸入，這時候就可以用上聯合型別：

```python
def process_item(item: int | str):
    print(item)
```

上面的意思是：process_item 這個函式會輸入整數或是字串型別的參數，任一皆可。

### 可選參數

有些參數的狀況比較特殊，函數的參數有可能會有，也有可能沒有，這時候也可以使用 Union 來指定這種狀況：

```python
def say_hi(name: str | None = None):
    if name is not None:
        print(f"Hey {name}!")
    else:
        print("Hello World")
```

上面的狀況表示，say_hi 函式所接受的參數，有可能是字串或是沒有指定，如果沒有指定變數，函式就依照判斷，改為執行沒有參數輸入的程式碼。

## Class 型別

你可以定義一個 class 當成變數的型別，就像這樣：

```python
class Person:
    def __init__(self, name: str):
        self.name = name


def get_person_name(one_person: Person):
    return one_person.name
```

這樣我們可以清楚知道，函式輸入的參數有定義好一個 name 屬性。在物件導向中，參數為 Person類別的實例化。

## 加上 Pydantic 升級成資料驗證

在[先前介紹 FastAPI 一文中](https://johnsontac.com/posts/python-rabbit-hole-fastapi/)有提到 Pydantic，它不但是 FastAPI 的標配之一，也是個相當熱門的 Python 資料驗證函式庫。Pydantic 就是以 Type Hint 為基礎，將原本只是註記的動作轉為「強制執行」。

```python
class User:
    def __init__(self, id: int, name: str):
        self.id = id
        self.name = name


user1 = User(id="abc", name=123)
```

以上程式碼，在 id 的輸入參數部分，即便有標註 int，傳入字串也不會怎麼樣，這可能導致後續執行時的潛在問題。

但如果你用上 Pydantic ，當程式執行時，Pydantice 就會依照提示「強制」擋下不符合的資料：

```python
from pydantic import BaseModel

class User(BaseModel):
    id: int
    name: str

user1 = User(id="123", name="Alice") 

try:
    user2 = User(id="abc", name="Bob")
except Exception as e:
    print(e)
```

上述程式碼中的`user1`輸入的`id`會自動轉換：傳入 "123" 會變成整數 123。

而在 `try...except`區塊的`user2`則會驗證失敗，因為在`id`傳入的`"abc"`無法轉換成`int`，會拋出 ValidationError。
## 結語

Type Hint 就像是 Python 程式碼的規格說明書，告訴大家這裡應該放什麼樣的資料。

Pydantic 就是拿著這份說明書的驗貨員，它負責把關程式碼執行時的資料出入，不符合規範的資料它就會擋下來，或是強制整改。

在撰寫程式碼的時候，以上的措施感覺相當繁瑣。但如果你有花心思在「定義資料」上，當未來程式碼發生問題，或是要重構的時候，你會慶幸自己沒有貪圖一時方便，導致錯誤難以追蹤。