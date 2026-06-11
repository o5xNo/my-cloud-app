// routes/game.js
const express = require('express');
const router = express.Router();

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: '請先登入才能儲存分數' });
}

module.exports = function(pool) {

  // 1. 提交新分數
  router.post('/scores', isAuthenticated, async (req, res) => {
    const { score } = req.body;
    const userId = req.user.id;

    try {
      await pool.query('INSERT INTO scores (user_id, score) VALUES ($1, $2)', [userId, score]);
      res.status(201).json({ message: '分數已上傳成功！' });
    } catch (err) {
      res.status(500).json({ message: '分數儲存失敗' });
    }
  });

  // 2. 取得排行榜資料 (全球前 10 名 + 個人最高分)
  router.get('/leaderboard', isAuthenticated, async (req, res) => {
    const userId = req.user.id;
    try {
      // 全球前 10 名：每個玩家只取他的最高紀錄
      const globalRes = await pool.query(`
        SELECT u.name, MAX(s.score) as max_score
        FROM scores s
        JOIN users u ON s.user_id = u.id
        GROUP BY u.id, u.name
        ORDER BY max_score DESC
        LIMIT 10
      `);

      // 個人最高分
      const personalRes = await pool.query(`
        SELECT MAX(score) as my_max_score 
        FROM scores 
        WHERE user_id = $1
      `, [userId]);

      res.json({
        global: globalRes.rows,
        personal: personalRes.rows[0].my_max_score || 0
      });
    } catch (err) {
      res.status(500).json({ message: '無法載入排行榜' });
    }
  });

  return router;
};