const express = require('express');
const router = express.Router();
const {
  getTurfs,
  getNearbyTurfs,
  getTurfById,
  createTurf,
  updateTurf,
  deleteTurf,
} = require('../controllers/turfController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// GET  /api/turfs/nearby?latitude=&longitude=&radius=   — must come before /:id
router.get('/nearby', getNearbyTurfs);

// GET  /api/turfs          — list all approved turfs
router.get('/', getTurfs);

// GET  /api/turfs/:id      — get single turf
router.get('/:id', getTurfById);

// POST /api/turfs          — create a turf (owner or admin)
router.post('/', authMiddleware, requireRole('owner', 'admin'), createTurf);

// PUT  /api/turfs/:id      — update a turf
router.put('/:id', authMiddleware, updateTurf);

// DELETE /api/turfs/:id    — delete a turf (owner or admin)
router.delete('/:id', authMiddleware, deleteTurf);

module.exports = router;
