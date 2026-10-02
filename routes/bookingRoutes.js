const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getTurfBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { authMiddleware } = require('../middleware/auth');

// All booking routes require authentication
router.use(authMiddleware);

// POST /api/bookings               — create a booking
router.post('/', createBooking);

// GET  /api/bookings/user/:id      — get bookings for a user
router.get('/user/:id', getUserBookings);

// GET  /api/bookings/turf/:id      — get bookings for a turf
router.get('/turf/:id', getTurfBookings);

// PUT  /api/bookings/:id/status    — update booking/payment status
router.put('/:id/status', updateBookingStatus);

module.exports = router;
