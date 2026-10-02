const express = require('express');
const router = express.Router();
const { signup, login, getProfile } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// POST /api/signup     — register a new user
router.post('/signup', signup);

// POST /api/login      — log in with email + password
router.post('/login', login);

// POST /api/auth/register — alias for /api/signup (REST convention)
router.post('/auth/register', signup);

// POST /api/auth/login    — alias for /api/login
router.post('/auth/login', login);

// GET  /api/profile    — get authenticated user's profile
router.get('/profile', authMiddleware, getProfile);

// GET  /api/users/profile — REST alias
router.get('/users/profile', authMiddleware, getProfile);

module.exports = router;
