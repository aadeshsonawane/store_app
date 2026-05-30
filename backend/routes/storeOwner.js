const express = require('express');
const router = express.Router();
const { verifyToken, isStoreOwner } = require('../middleware/auth');
const {
  getDashboard,
  getRatedUsers,
  updatePassword,
} = require('../controllers/storeOwnerController');

router.get('/dashboard', verifyToken, isStoreOwner, getDashboard);
router.get('/rated-users', verifyToken, isStoreOwner, getRatedUsers);
router.put('/password', verifyToken, isStoreOwner, updatePassword);

module.exports = router;