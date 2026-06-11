// server.js
const express = require('express'); // 1. 引入 Express (原本漏掉了)
const { Pool } = require('pg');
require('dotenv').config();

const app = express(); // 2. 初始化 Express 實例 (原本漏掉了)

// 中間件設定 (解析 JSON 與表單資料)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 使用 Neon 提供的連線字串建立連線池
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Neon 要求必須使用 SSL 安全連線
});

// 初始化 PostgreSQL 資料表
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE,
        password TEXT,
        google_id TEXT,
        name TEXT
      )
    `);
    console.log("Neon PostgreSQL 資料表初始化成功！");
  } catch (err) {
    console.error("資料庫初始化失敗:", err);
  }
})();

// 3. 新增一個簡單的根路由 (防止 Render 檢查首頁時回傳 404)
app.get('/', (req, res) => {
  res.send('<h1>Node.js 雲端伺服器運行中！</h1>');
});

// 這裡稍後可以串接你的驗證路由，例如：
// const authRoutes = require('./routes/auth')(pool);
// app.use('/auth', authRoutes);

// 監聽連接埠
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`伺服器正運作於 Port: ${PORT}`);
});