_README更新日期： 2025/8/6_

# Shiny Frame

**Shiny Frame**
Vue 3 + TypeScript + Vite 開發框架

- [GitHub](https://github.com/VickyChan096/shiny-frame)
- [GitHub Pages](https://vickychan096.github.io/shiny-frame/)

## 技術棧

**前端技術**
Vue3, TypeScript, SCSS

## 前端開發規範要點

**開發規範要點**

- 使用 @ 引入專案內部的檔案
- 優先使用箭頭函式
- 必要時加上註解

## Vue, JavaScript, TypeScript 結構與命名規範

### Vue 文件結構順序

```
<script lang="ts" setup>
1. import (依資料夾順序排序)
2. emits
3. props
4. 變數 (建議優先使用 ref)
5. computed
6. function
7. watch、watchEffect
8. onMounted
9. 其他
</script>
```

### 命名規範

**變數與函式命名原則、程式碼風格**

- 使用 camelCase 命名法
- 函數名稱應該是動詞或動詞短語
- 常數可使用 UPPER_CASE
- interface 不須前墜 I
- block 的大誇號由同一行開始如

```ts
if (someBool) {
}
```

**檔案與資料夾命名原則**

- components 的元件使用 PascalCase 命名法
- types 的 ts 檔使用 PascalCase 命名法
- enum 檔名與 enum 使用 PascalCase 命名法
- 其餘皆使用 camelCase 命名法

## CSS 撰寫風格

**風格與命名**

- 優先使用 Scoped Styles
- CSS Class 命名採用 SCSS + BEM (Block-Element-Modifier) 標準，並使用連字符命名
- 避免無意義的巢狀結構，如有巢狀也請盡量不要超過 3 層

**響應式設計斷點**

- @mixin：
  - largeDesktop (max-width: 2560px)
  - desktop (max-width: 1920px)
  - min-desktop (max-width: 1440px)
  - pad (max-width: 1200px)
  - mobile (max-width: 767px)
  - min-mobile (max-width: 375px)

## 專案設置

```bash
npm install
```

## 開發環境

啟動開發伺服器，預設運行於 `http://localhost:1234`:

```bash
npm run dev
```

## 生產環境

```bash
# npm
npm run build
```

## 本地預覽生產環境的構建結果

```bash
npm run preview
```
