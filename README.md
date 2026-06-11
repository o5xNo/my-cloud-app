# 🚀 Node.js 全端雲端應用服務 (My Cloud App)

這是一個基於 **Node.js (Express)**、**Neon PostgreSQL** 與前端 **HTML5 Canvas** 開發的全端 Web 應用程式。專案具備完整的使用者驗證機制，並整合了即時社群論壇以及內建全球即時排行榜的貪吃蛇小遊戲。

目前已成功部署於 **Render** 雲端平台。

🔗 **線上展示網址**：[https://my-cloud-app-snn9.onrender.com/](https://my-cloud-app-snn9.onrender.com/)

---

## 🌟 核心功能特色

### 1. 🔐 會員驗證系統 (Authentication)
- **安全註冊與登入**：密碼採用 `bcryptjs` 進行強力雜湊加密儲存，安全防護極高。
- **Session 狀態維持**：整合 `passport` 與 `express-session`，登入後自動維持會員狀態，未登入者無法擅自進入後台或進行游玩、發文。
- **磨砂玻璃視覺 UI**：提供俐落現代的前端登入與註冊切換介面。

### 2. 💬 互動式社群論壇 (Collapsible Forum)
- **發表文章**：登入會員可自由發布主題文章，系統自動關聯作者帳號與發文時間。
- **動態摺疊留言板**：採用現代化的深色系討論區設計，留言預設隱藏。玩家點擊「顯示回覆」時，前端才會動態向後端撈取即時留言，大幅提升網頁流暢度與排版整潔度。

### 3. 🐍 雲端競技：經典貪吃蛇小遊戲 (Snake Game)
- **極致流暢操控**：同時完整支援傳統鍵盤 **方向鍵 (↑ ↓ ← →)** 與現代玩家最習慣的 **WASD** 雙控制系統。
- **鍵盤視覺回饋**：右側操作面板設計了虛擬鍵盤，當玩家在鍵盤按下 W、A、S、D 時，畫面按鈕會同步亮燈高亮。
- **遊戲節奏優化**：貼心設計「點擊開始 (Click to Start)」待機畫面，並將蛇的移動步伐減速一半，提供更佳的手感與遊戲體驗。

### 4. 🏆 即時全球榮譽排行榜 (Leaderboard)
- **個人最高分紀錄**：即時顯示玩家帳號在資料庫中的歷史最高得分。
- **全球前 10 強榜單**：利用 PostgreSQL 的關聯查詢（Group By & Max Score），動態撈出全球前 10 名的頂尖高玩，前三名更配有 🥇、🥈、🥉 專屬勳章。

---

## 🛠️ 技術棧 (Tech Stack)

- **後端 (Backend)**: Node.js, Express.js
- **資料庫 (Database)**: Neon PostgreSQL (雲端無伺服器關聯式資料庫)
- **身分驗證 (Auth)**: Passport.js (Local Strategy), BCrypt.js, Express-Session
- **前端 (Frontend)**: Vanilla JavaScript, HTML5 Canvas, CSS3 (現代深色系響應式 UI)
- **雲端部署 (Deployment)**: Render Web Service

---

## 📂 專案目錄結構

```text
my-cloud-app/
├── config/
│   └── passport.js      # Passport 本地登入與 Session 序列化策略
├── routes/
│   ├── auth.js          # 會員註冊、登入、登出與狀態檢查 API
│   ├── forum.js         # 論壇文章取得、發表與留言串讀寫 API
│   └── game.js          # 遊戲分數提交、個人與全球排行榜撈取 API
├── public/              # 前端靜態網頁託管資料夾
│   ├── index.html       # 會員登入 / 註冊首頁
│   ├── dashboard.html   # 會員中心主後台
│   ├── forum.html       # 摺疊式社群討論區
│   └── game.html        # 貪吃蛇小遊戲與即時控制器面板
├── .env                 # 環境變數設定檔 (DATABASE_URL, SESSION_SECRET)
├── server.js            # 後端主程式（Express 伺服器與 PostgreSQL 初始化）
├── package.json         # 專案相依套件與腳本設定
└── README.md            # 本說明文件