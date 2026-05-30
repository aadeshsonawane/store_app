const db = require('../models/db');
const bcrypt = require('bcryptjs');

// Get store owner dashboard
exports.getDashboard = (req, res) => {
  const ownerId = req.user.id;

  const sql = `
    SELECT s.id, s.name, s.address,
      ROUND(AVG(r.rating), 1) as avgRating,
      COUNT(r.id) as totalRatings
    FROM stores s
    LEFT JOIN ratings r ON r.store_id = s.id
    WHERE s.owner_id = ?
    GROUP BY s.id
  `;

  db.query(sql, [ownerId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

// Get users who rated the store
exports.getRatedUsers = (req, res) => {
  const ownerId = req.user.id;

  const sql = `
    SELECT u.id, u.name, u.email, r.rating
    FROM ratings r
    JOIN users u ON u.id = r.user_id
    JOIN stores s ON s.id = r.store_id
    WHERE s.owner_id = ?
  `;

  db.query(sql, [ownerId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

// Update password
exports.updatePassword = async (req, res) => {
  const ownerId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  const sql = 'SELECT * FROM users WHERE id = ?';
  db.query(sql, [ownerId], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });

    const user = results[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, ownerId], (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ message: 'Password updated successfully' });
    });
  });
};