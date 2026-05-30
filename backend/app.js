const express = require('express');
const cors = require('cors');
require('dotenv').config()
const db = require('./models/db');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});