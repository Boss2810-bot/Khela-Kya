const Contact = require('../models/Contact');

// ─── POST /api/contact ────────────────────────────────────────────────────────
async function createContact(req, res) {
  try {
    const name    = String(req.body?.name    || '').trim().slice(0, 80);
    const email   = String(req.body?.email   || '').trim().toLowerCase();
    const subject = String(req.body?.subject || '').trim().slice(0, 120) || 'Contact from Khela Kya';
    const message = String(req.body?.message || '').trim().slice(0, 2000);

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Enter a valid email address' });
    }

    const contact = await Contact.create({ name, email, subject, message });
    return res.json({ id: contact._id, message: 'Saved' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map((e) => e.message).join(', ');
      return res.status(400).json({ message: msg });
    }
    console.error('[createContact]', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { createContact };
