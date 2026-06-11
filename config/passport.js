// config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');

module.exports = function(db) {
  // 序列化與反序列化使用者 (Session 儲存)
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
    done(null, user);
  });

  // 1. 本地登入策略
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
      if (!user || !user.password) {
        return done(null, false, { message: '帳號不存在或請使用第三方登入' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: '密碼錯誤' });
      return done(null, user);
    } catch (err) { return done(err); }
  }));

  // 2. Google 第三方登入策略
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // 檢查使用者是否已存在
      let user = await db.get('SELECT * FROM users WHERE google_id = ?', [profile.id]);
      if (!user) {
        // 建立新使用者
        const result = await db.run(
          'INSERT INTO users (name, email, google_id) VALUES (?, ?, ?)',
          [profile.displayName, profile.emails[0].value, profile.id]
        );
        user = { id: result.lastID, name: profile.displayName };
      }
      return done(null, user);
    } catch (err) { return done(err); }
  }));
};