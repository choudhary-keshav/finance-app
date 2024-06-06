const express = require('express');
const {
  registerUser,
  loginUser,
  updateUser,
} = require('../controllers/userControllers');
const authenticateToken = require('../middleware/authenticationMiddleware');
const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.put('/update', authenticateToken, updateUser);

module.exports = router;
