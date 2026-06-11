// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

module.exports = function(pool) {
  
  // 【功能：創建帳號 (註冊)】
  router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: '請填寫完整欄位' });
    }

    try {
      // 密碼加密
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // 寫入 Neon PostgreSQL ($1, $2, $3 是安全防 SQL 注入的寫法)
      await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
        [name, email, hashedPassword]
      );
      
      res.status(201).json({ message: '帳號創建成功！' });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: '該 Email 已被註冊或發生錯誤' });
    }
  });

  // 【功能：登入】
  // 這裡使用 passport 的本地驗證策略，成功後回傳 JSON 或跳轉
  router.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({ message: '登入成功！', user: { id: req.user.id, name: req.user.name, email: req.user.email } });
  });

  // 【功能：登出】
  router.get('/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ message: '已成功登出！' });
    });
  });

  // 【測試用：檢查目前登入狀態】
  router.get('/current-user', (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ loggedIn: true, user: req.user });
    } else {
      res.json({ loggedIn: false });
    }
  });

  return router;
};