const db = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
  const { name, email, password, address } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, "user")';
    db.query(sql, [name, email, hashedPassword, address], (err, result) => {
      if (err) return res.status(400).json({ message: err.message });
      res.status(201).json({ message: 'User registered successfully' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (results.length === 0) return res.status(400).json({ message: 'User not found' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });
};