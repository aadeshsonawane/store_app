const db = require('../models/db');
const bcrypt = require('bcryptjs');

// Dashboard stats
exports.getDashboard = (req, res) => {
  const sql = `
    SELECT 
      (SELECT COUNT(*) FROM users) as totalUsers,
      (SELECT COUNT(*) FROM stores) as totalStores,
      (SELECT COUNT(*) FROM ratings) as totalRatings
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results[0]);
  });
};

// Add user
exports.addUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, email, hashedPassword, address, role], (err, result) => {
      if (err) return res.status(400).json({ message: err.message });
      res.status(201).json({ message: 'User added successfully' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users
exports.getUsers = (req, res) => {
  const { name, email, address, role } = req.query;
  let sql = 'SELECT id, name, email, address, role FROM users WHERE 1=1';
  const params = [];

  if (name) { sql += ' AND name LIKE ?'; params.push(`%${name}%`); }
  if (email) { sql += ' AND email LIKE ?'; params.push(`%${email}%`); }
  if (address) { sql += ' AND address LIKE ?'; params.push(`%${address}%`); }
  if (role) { sql += ' AND role = ?'; params.push(role); }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

// Get user by id
exports.getUserById = (req, res) => {
  const sql = `
    SELECT u.id, u.name, u.email, u.address, u.role,
      AVG(r.rating) as avgRating
    FROM users u
    LEFT JOIN ratings r ON r.user_id = u.id
    WHERE u.id = ?
    GROUP BY u.id
  `;
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(results[0]);
  });
};

// Add store
exports.addStore = async (req, res) => {
  const { name, email, address, owner_id } = req.body;
  const sql = 'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, address, owner_id], (err, result) => {
    if (err) return res.status(400).json({ message: err.message });
    res.status(201).json({ message: 'Store added successfully' });
  });
};

// Get all stores
exports.getStores = (req, res) => {
  const { name, email, address } = req.query;
  let sql = `
    SELECT s.id, s.name, s.email, s.address, 
      ROUND(AVG(r.rating), 1) as avgRating
    FROM stores s
    LEFT JOIN ratings r ON r.store_id = s.id
    WHERE 1=1
  `;
  const params = [];

  if (name) { sql += ' AND s.name LIKE ?'; params.push(`%${name}%`); }
  if (email) { sql += ' AND s.email LIKE ?'; params.push(`%${email}%`); }
  if (address) { sql += ' AND s.address LIKE ?'; params.push(`%${address}%`); }

  sql += ' GROUP BY s.id';

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};