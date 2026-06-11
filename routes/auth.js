// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

module.exports = function(db) {
  // 【功能：創建帳號】
  router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.run(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );
      res.status(201).send('註冊成功！');
    } catch (err) {
      res.status(400).send('該 Email 已被註冊');
    }
  });

  // 【功能：本地登入】
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  }));

  // 【功能：Google 第三方登入】
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  }));

  // 【功能：登出】
  router.get('/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.redirect('/login');
    });
  });

  return router;
};