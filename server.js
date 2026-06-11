// server.js 完整版
const express = require('express');
const { Pool } = require('pg');
const session = require('express-session'); // 引入 Session
const passport = require('passport');       // 引入 Passport
require('dotenv').config();

const app = express();
app.use(express.static('public'));

// 中間件設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 設定 Session 儲存機制
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // 在 Render 免費層（有隨附 SSL）一般設為 false 即可，若強迫 https 可調為 true
}));

// 初始化 Passport
app.use(passport.initialize());
app.use(passport.session());

// 連接 Neon PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 初始化資料表
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

// 載入 Passport 設定策略
require('./config/passport')(passport, pool);

// 載入並掛載驗證路由 (註冊、登入、登出都會在 /auth 路徑下)
const authRoutes = require('./routes/auth')(pool);
app.use('/auth', authRoutes);

// 首頁
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// 監聽埠
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`伺服器正運作於 Port: ${PORT}`);
});