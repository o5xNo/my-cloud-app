// server.js (修改後的版本)
const { Pool } = require('pg');
require('dotenv').config();

// 使用 Neon 提供的連線字串建立連線池
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Neon 要求必須使用 SSL 安全連線
});

// 初始化 PostgreSQL 資料表 (語法與 SQLite 略有不同，SERIAL 代替 AUTOINCREMENT)
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

// 將 pool 傳遞給你的路由與 Passport 設定
// 例如：app.use('/auth', authRoutes(pool));