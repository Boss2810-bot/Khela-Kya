const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || process.env.KK_SECRET || 'change_this_secret_in_prod';
const JWT_EXPIRES_IN = '7d';

/**
 * Generate a signed JWT for a user document.
 */
function createToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Sanitize user object for API responses — never expose the password field.
 */
function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.fullName || user.email,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    city: user.city,
    role: user.role,
    profileImage: user.profileImage,
    created_at: user.createdAt, // kept for backward compat with auth.js frontend
    createdAt: user.createdAt,
  };
}

// ─── POST /api/signup ─────────────────────────────────────────────────────────
async function signup(req, res) {
  try {
    const name     = String(req.body?.name     || '').trim().slice(0, 80);
    const email    = String(req.body?.email    || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const phone    = String(req.body?.phone    || '').trim().slice(0, 20);
    const city     = String(req.body?.city     || '').trim().slice(0, 60);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Enter a valid email address' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const user = await User.create({
      fullName: name || undefined,
      email,
      password,   // pre-save hook hashes it
      phone: phone || undefined,
      city: city || undefined,
    });

    const token = createToken(user);
    return res.status(201).json({ user: sanitizeUser(user), token });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already used' });
    }
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map((e) => e.message).join(', ');
      return res.status(400).json({ message: msg });
    }
    console.error('[signup]', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// ─── POST /api/login ──────────────────────────────────────────────────────────
async function login(req, res) {
  try {
    const email    = String(req.body?.email    || '').trim().toLowerCase();
    const password = String(req.body?.password || '');

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // +password to include the select:false field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user);
    return res.json({ user: sanitizeUser(user), token });
  } catch (err) {
    console.error('[login]', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// ─── GET /api/profile ─────────────────────────────────────────────────────────
async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ user: sanitizeUser(user) });
  } catch (err) {
    console.error('[getProfile]', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { signup, login, getProfile };
