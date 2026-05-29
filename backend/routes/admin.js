
const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const {
  getDashboard,
  addUser,
  getUsers,
  getUserById,
  addStore,
  getStores,
} = require('../controllers/adminController');

router.get('/dashboard', verifyToken, isAdmin, getDashboard);
router.post('/users', verifyToken, isAdmin, addUser);
router.get('/users', verifyToken, isAdmin, getUsers);
router.get('/users/:id', verifyToken, isAdmin, getUserById);
router.post('/stores', verifyToken, isAdmin, addStore);
router.get('/stores', verifyToken, isAdmin, getStores);

module.exports = router;