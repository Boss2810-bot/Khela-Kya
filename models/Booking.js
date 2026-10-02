const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      default: () => `KK-${uuidv4().slice(0, 8).toUpperCase()}`,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    turfId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Turf',
      required: [true, 'Turf ID is required'],
    },
    bookingDate: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    duration: {
      type: Number, // in hours
      required: [true, 'Duration is required'],
      min: [0.5, 'Minimum booking duration is 30 minutes'],
      max: [12, 'Maximum booking duration is 12 hours'],
    },
    players: {
      type: Number,
      min: [1, 'At least 1 player required'],
      max: [200, 'Player count exceeds limit'],
      default: 10,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    coupon: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 30,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded', 'Failed'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['upi', 'card', 'pay-at-venue', 'online'],
      default: 'pay-at-venue',
    },
    bookingStatus: {
      type: String,
      enum: ['Upcoming', 'Completed', 'Cancelled'],
      default: 'Upcoming',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
bookingSchema.index({ userId: 1, bookingDate: -1 });
bookingSchema.index({ turfId: 1, bookingDate: 1 });
bookingSchema.index({ bookingId: 1 }, { unique: true });
bookingSchema.index({ bookingStatus: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ bookingDate: 1 });

// ─── Virtual: net total after discount ───────────────────────────────────────
bookingSchema.virtual('netTotal').get(function () {
  return Math.max(0, this.price - (this.discount || 0));
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
