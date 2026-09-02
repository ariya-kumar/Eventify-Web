const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register/user', authController.registerUser);
router.post('/register/organizer', authController.registerOrganizer);
router.post('/login', authController.login);
router.get('/me', authController.getMe);

module.exports = router;
