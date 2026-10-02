const Booking = require('../models/Booking');
const Turf    = require('../models/Turf');

// ─── Valid coupon codes (extend or move to DB in future) ──────────────────────
const COUPONS = {
  PLAY20:  { type: 'percent', value: 20 },
  FLAT100: { type: 'flat',    value: 100 },
  KK50:    { type: 'flat',    value: 50 },
};

function applyCoupon(price, coupon) {
  if (!coupon) return 0;
  const code = COUPONS[String(coupon).toUpperCase()];
  if (!code) return 0;
  if (code.type === 'percent') return Math.round((price * code.value) / 100);
  return Math.min(code.value, price);
}

// ─── POST /api/bookings ───────────────────────────────────────────────────────
async function createBooking(req, res) {
  try {
    const body = req.body || {};

    const turfId     = body.turfId;
    const bookingDate = body.bookingDate ? new Date(body.bookingDate) : null;
    const startTime  = String(body.startTime || '').trim();
    const duration   = parseFloat(body.duration || 1);
    const players    = parseInt(body.players  || 10, 10);
    const coupon     = String(body.coupon || '').trim().toUpperCase();
    const paymentMethod = body.paymentMethod || 'pay-at-venue';

    if (!turfId)      return res.status(400).json({ message: 'turfId is required' });
    if (!bookingDate) return res.status(400).json({ message: 'bookingDate is required' });
    if (!startTime)   return res.status(400).json({ message: 'startTime is required' });
    if (isNaN(duration) || duration < 0.5) {
      return res.status(400).json({ message: 'Invalid duration' });
    }

    // Fetch turf to calculate price
    const turf = await Turf.findById(turfId);
    if (!turf) return res.status(404).json({ message: 'Turf not found' });

    // Weekend/weekday pricing
    const day = new Date(bookingDate).getDay();
    const isWeekend = day === 0 || day === 6;
    const hourlyRate = isWeekend ? (turf.weekendPrice || turf.weekdayPrice) : turf.weekdayPrice;
    const basePrice = hourlyRate * duration;
    const discount  = applyCoupon(basePrice, coupon);
    const finalPrice = Math.max(0, basePrice - discount);

    // Simple end-time calculation
    const [startH, startM] = startTime.split(':').map(Number);
    const endTotalMin = (startH * 60 + (startM || 0)) + duration * 60;
    const endH = Math.floor(endTotalMin / 60) % 24;
    const endM = Math.floor(endTotalMin % 60);
    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    const booking = await Booking.create({
      userId:        req.user.id,
      turfId,
      bookingDate,
      startTime,
      endTime,
      duration,
      players,
      price:         finalPrice,
      discount,
      coupon:        coupon || undefined,
      paymentMethod,
      paymentStatus: paymentMethod === 'pay-at-venue' ? 'Pending' : 'Pending',
      bookingStatus: 'Upcoming',
    });

    // Increment turf booking count
    Turf.findByIdAndUpdate(turfId, { $inc: { totalBookings: 1 } }).exec();

    return res.status(201).json({
      bookingId: booking.bookingId,
      booking,
      message: 'Booking confirmed!',
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map((e) => e.message).join(', ');
      return res.status(400).json({ message: msg });
    }
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid ID' });
    console.error('[createBooking]', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// ─── GET /api/bookings/user/:id ───────────────────────────────────────────────
async function getUserBookings(req, res) {
  try {
    // Users can only see their own bookings; admins can see any
    const targetId = req.params.id;
    if (req.user.role !== 'admin' && req.user.id !== targetId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const bookings = await Booking.find({ userId: targetId })
      .populate('turfId', 'turfName address city mainImage')
      .sort({ bookingDate: -1 });

    return res.json(bookings);
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid user ID' });
    console.error('[getUserBookings]', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// ─── GET /api/bookings/turf/:id ───────────────────────────────────────────────
async function getTurfBookings(req, res) {
  try {
    const turf = await Turf.findById(req.params.id).select('ownerId');
    if (!turf) return res.status(404).json({ message: 'Turf not found' });

    const isAdmin = req.user.role === 'admin';
    const isOwner = turf.ownerId && turf.ownerId.toString() === req.user.id;
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const bookings = await Booking.find({ turfId: req.params.id })
      .populate('userId', 'fullName email phone')
      .sort({ bookingDate: -1 });

    return res.json(bookings);
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid turf ID' });
    console.error('[getTurfBookings]', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// ─── PUT /api/bookings/:id/status ─────────────────────────────────────────────
async function updateBookingStatus(req, res) {
  try {
    const { bookingStatus, paymentStatus } = req.body || {};

    const booking = await Booking.findById(req.params.id).populate('turfId', 'ownerId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const isAdmin  = req.user.role === 'admin';
    const isOwner  = booking.turfId?.ownerId?.toString() === req.user.id;
    const isHolder = booking.userId.toString() === req.user.id;

    if (!isAdmin && !isOwner && !isHolder) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updates = {};
    if (bookingStatus) updates.bookingStatus = bookingStatus;
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    const updated = await Booking.findByIdAndUpdate(req.params.id, updates, { new: true });
    return res.json(updated);
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid booking ID' });
    console.error('[updateBookingStatus]', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { createBooking, getUserBookings, getTurfBookings, updateBookingStatus };
