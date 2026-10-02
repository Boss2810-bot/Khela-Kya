const mongoose = require('mongoose');

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const slotSchema = new mongoose.Schema(
  {
    time: { type: String, required: true },
    available: { type: Boolean, default: true },
  },
  { _id: false }
);

const reviewItemSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    rating: { type: Number, min: 1, max: 5 },
    date: { type: String },
    verified: { type: Boolean, default: false },
    text: { type: String, trim: true, maxlength: 1000 },
    photos: [{ type: String }],
  },
  { _id: false }
);

// ─── Main Turf schema ─────────────────────────────────────────────────────────

const turfSchema = new mongoose.Schema(
  {
    // ── Basic Information ─────────────────────────────────────────────────────
    turfName: {
      type: String,
      required: [true, 'Turf name is required'],
      trim: true,
      maxlength: [120, 'Turf name cannot exceed 120 characters'],
    },
    ownerName: { type: String, trim: true, maxlength: 80 },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email'],
    },
    phone: { type: String, trim: true, maxlength: 20 },

    // ── Location ──────────────────────────────────────────────────────────────
    address: { type: String, trim: true, maxlength: 300 },
    landmark: { type: String, trim: true, maxlength: 200 },
    city: { type: String, trim: true, maxlength: 60 },
    area: { type: String, trim: true, maxlength: 100 },
    state: { type: String, trim: true, maxlength: 60 },
    country: { type: String, trim: true, maxlength: 60, default: 'India' },
    pincode: { type: String, trim: true, maxlength: 10 },

    // ── Geospatial (GeoJSON Point) ─────────────────────────────────────────────
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude] — GeoJSON order
        default: [0, 0],
      },
    },

    // ── Google Maps ───────────────────────────────────────────────────────────
    googleMapsLink: { type: String, trim: true },
    placeId: { type: String, trim: true },

    // ── Sports Available ──────────────────────────────────────────────────────
    sports: {
      type: [String],
      enum: ['Football', 'Cricket', 'Badminton', 'Basketball', 'Tennis', 'Pickleball', 'Volleyball', 'Hockey', 'Other'],
      default: ['Football', 'Cricket'],
    },

    // ── Ground Details ────────────────────────────────────────────────────────
    venueType: {
      type: String,
      enum: ['Indoor', 'Outdoor'],
      default: 'Outdoor',
    },
    turfType: {
      type: String,
      enum: ['Artificial Turf', 'Natural Grass', 'Clay', 'Concrete', 'Other'],
      default: 'Artificial Turf',
    },
    groundSize: { type: String, trim: true, maxlength: 80 },
    playerCapacity: { type: Number, min: 2, max: 200, default: 22 },

    // ── Pricing ───────────────────────────────────────────────────────────────
    weekdayPrice: { type: Number, min: 0, default: 300 },
    weekendPrice: { type: Number, min: 0, default: 400 },
    holidayPrice: { type: Number, min: 0, default: 400 },

    // ── Operating Hours ───────────────────────────────────────────────────────
    openingTime: { type: String, default: '06:00' },
    closingTime: { type: String, default: '22:00' },

    // ── Amenities ─────────────────────────────────────────────────────────────
    amenities: {
      parking: { type: Boolean, default: false },
      washroom: { type: Boolean, default: false },
      changingRoom: { type: Boolean, default: false },
      shower: { type: Boolean, default: false },
      drinkingWater: { type: Boolean, default: false },
      floodLights: { type: Boolean, default: false },
      wifi: { type: Boolean, default: false },
      cafe: { type: Boolean, default: false },
      locker: { type: Boolean, default: false },
      firstAid: { type: Boolean, default: false },
      seatingArea: { type: Boolean, default: false },
    },

    // ── Images ────────────────────────────────────────────────────────────────
    mainImage: { type: String, default: null },
    galleryImages: [{ type: String }],

    // ── Rating ────────────────────────────────────────────────────────────────
    averageRating: { type: Number, min: 0, max: 5, default: 0 },
    totalReviews: { type: Number, default: 0 },

    // ── Description & Rules ───────────────────────────────────────────────────
    description: { type: String, trim: true, maxlength: 2000 },
    rules: { type: String, trim: true, maxlength: 1000 },
    cancellationPolicy: { type: String, trim: true, maxlength: 1000 },

    // ── Verification & Approval ───────────────────────────────────────────────
    isVerified: { type: Boolean, default: false },
    approvalStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },

    // ── Popularity & Visibility ───────────────────────────────────────────────
    totalBookings: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    offer: { type: String, trim: true, maxlength: 80 },

    // ── Legacy flat fields (kept for frontend compatibility) ──────────────────
    // These are populated from the main fields and used by turfs.js frontend
    legacySlots: [slotSchema],
    legacyReviews: [reviewItemSchema],
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
turfSchema.index({ location: '2dsphere' }); // geospatial index for nearby search
turfSchema.index({ city: 1 });
turfSchema.index({ sports: 1 });
turfSchema.index({ approvalStatus: 1 });
turfSchema.index({ averageRating: -1 });
turfSchema.index({ weekdayPrice: 1 });
turfSchema.index({ featured: -1, averageRating: -1 });
turfSchema.index({ turfName: 'text', address: 'text', city: 'text', area: 'text' });

// ─── Virtual: expose lat/lng from GeoJSON coordinates ────────────────────────
turfSchema.virtual('lat').get(function () {
  // GeoJSON: [lng, lat]
  return this.location && this.location.coordinates ? this.location.coordinates[1] : null;
});

turfSchema.virtual('lng').get(function () {
  return this.location && this.location.coordinates ? this.location.coordinates[0] : null;
});

const Turf = mongoose.model('Turf', turfSchema);

module.exports = Turf;
