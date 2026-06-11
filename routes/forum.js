// routes/forum.js
const express = require('express');
const router = express.Router();

// 檢查是否登入的中間件
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: '請先登入才能執行此操作' });
}

module.exports = function(pool) {

  // 1. 獲取所有文章 (包含作者名字)
  router.get('/posts', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT p.*, u.name as author_name 
        FROM posts p 
        JOIN users u ON p.user_id = u.id 
        ORDER BY p.created_at DESC
      `);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ message: '伺服器錯誤' });
    }
  });

  // 2. 發表新文章
  router.post('/posts', isAuthenticated, async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.id; // 從 Session 中取得目前登入的用戶 ID

    try {
      await pool.query(
        'INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3)',
        [userId, title, content]
      );
      res.status(201).json({ message: '文章發表成功！' });
    } catch (err) {
      res.status(500).json({ message: '發表失敗' });
    }
  });

  // 3. 獲取某篇特定文章的「所有留言」
  router.get('/posts/:postId/comments', async (req, res) => {
    const { postId } = req.params;
    try {
      const result = await pool.query(`
        SELECT c.*, u.name as author_name 
        FROM comments c 
        JOIN users u ON c.user_id = u.id 
        WHERE c.post_id = $1 
        ORDER BY c.created_at ASC
      `, [postId]);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ message: '無法讀取留言' });
    }
  });

  // 4. 發表新留言
  router.post('/posts/:postId/comments', isAuthenticated, async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    try {
      await pool.query(
        'INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)',
        [postId, userId, content]
      );
      res.status(201).json({ message: '留言成功！' });
    } catch (err) {
      res.status(500).json({ message: '留言失敗' });
    }
  });

  return router;
};