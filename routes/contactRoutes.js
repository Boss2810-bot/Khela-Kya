const express = require('express');
const router = express.Router();
const { createContact } = require('../controllers/contactController');

// POST /api/contact   — submit a contact message (no auth required)
router.post('/', createContact);

module.exports = router;
