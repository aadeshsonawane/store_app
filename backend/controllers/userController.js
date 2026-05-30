const db = require('../models/db');
const bcrypt = require('bcryptjs');

// Get all stores with user's rating
exports.getStores = (req, res) => {
  const userId = req.user.id;
  const { name, address } = req.query;

  let sql = `
    SELECT s.id, s.name, s.address, 
      ROUND(AVG(r.rating), 1) as overallRating,
      ur.rating as userRating
    FROM stores s
    LEFT JOIN ratings r ON r.store_id = s.id
    LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = ?
    WHERE 1=1
  `;
  const params = [userId];

  if (name) { sql += ' AND s.name LIKE ?'; params.push(`%${name}%`); }
  if (address) { sql += ' AND s.address LIKE ?'; params.push(`%${address}%`); }

  sql += ' GROUP BY s.id, ur.rating';

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

// Submit or update rating
exports.submitRating = (req, res) => {
  const userId = req.user.id;
  const { store_id, rating } = req.body;

  const sql = `
    INSERT INTO ratings (user_id, store_id, rating)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE rating = ?
  `;
  db.query(sql, [userId, store_id, rating, rating], (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'Rating submitted successfully' });
  });
};

// Update password
exports.updatePassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  const sql = 'SELECT * FROM users WHERE id = ?';
  db.query(sql, [userId], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });

    const user = results[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ message: 'Password updated successfully' });
    });
  });
};