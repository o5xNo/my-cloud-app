// config/passport.js
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

module.exports = function(passport, pool) {
  // Session 序列化：登入成功後，將用戶 ID 存入 Session Cookie
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Session 反序列化：後續請求憑 ID 從資料庫撈出用戶完整資料
  passport.deserializeUser(async (id, done) => {
    try {
      const result = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [id]);
      done(null, result.rows[0]);
    } catch (err) {
      done(err);
    }
  });

  // 設定本地帳密驗證策略
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      // 從 PostgreSQL 撈出使用者
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];

      if (!user) {
        return done(null, false, { message: '帳號不存在' });
      }

      // 比對密碼
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: '密碼錯誤' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
};