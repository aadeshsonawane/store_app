const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getStores, submitRating, updatePassword } = require('../controllers/userController');

router.get('/stores', verifyToken, getStores);
router.post('/rating', verifyToken, submitRating);
router.put('/password', verifyToken, updatePassword);

module.exports = router;