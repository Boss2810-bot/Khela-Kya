const Turf = require('../models/Turf');

/**
 * Convert a Mongoose Turf document into the shape the frontend (turfs.js) expects.
 * This preserves 100% backward compatibility with the existing UI.
 */
function turfToFrontend(turf) {
  const t = turf.toObject ? turf.toObject({ virtuals: true }) : turf;

  // Build amenities array (string list) from the Boolean sub-document
  const amenityMap = {
    Parking: t.amenities?.parking,
    Washroom: t.amenities?.washroom,
    'Changing Room': t.amenities?.changingRoom,
    Shower: t.amenities?.shower,
    'Drinking Water': t.amenities?.drinkingWater,
    'Flood Lights': t.amenities?.floodLights,
    WiFi: t.amenities?.wifi,
    Cafe: t.amenities?.cafe,
    Locker: t.amenities?.locker,
    'First Aid': t.amenities?.firstAid,
    'Seating Area': t.amenities?.seatingArea,
  };
  const amenityList = Object.entries(amenityMap)
    .filter(([, v]) => v)
    .map(([k]) => k);

  // Add venue/surface type chips the old UI shows in amenities
  if (t.venueType) amenityList.push(t.venueType);
  if (t.turfType) amenityList.push(t.turfType);

  return {
    id: t._id,
    _id: t._id,
    name: t.turfName,
    owner: t.ownerName,
    phone: t.phone,
    addr: t.address,
    area: t.area,
    city: t.city,
    pincode: t.pincode,
    lat: t.lat,   // from virtual
    lng: t.lng,   // from virtual
    sports: t.sports || [],
    price: t.weekdayPrice || 300,
    weekdayPrice: t.weekdayPrice,
    weekendPrice: t.weekendPrice,
    holidayPrice: t.holidayPrice,
    rating: t.averageRating || 0,
    reviews: t.totalReviews || 0,
    open: t.openingTime,
    close: t.closingTime,
    verified: t.isVerified,
    approvalStatus: t.approvalStatus,
    offer: t.offer,
    image: t.mainImage,
    gallery: t.galleryImages || [],
    amenities: amenityList,
    groundSize: t.groundSize,
    venueType: t.venueType,
    grassType: t.turfType,
    description: t.description,
    slots: t.legacySlots || [],
    reviewsList: t.legacyReviews || [],
    featured: t.featured,
    totalBookings: t.totalBookings,
    googleMapsLink: t.googleMapsLink,
    cancellationPolicy: t.cancellationPolicy,
    createdAt: t.createdAt,
  };
}

// ─── GET /api/turfs ───────────────────────────────────────────────────────────
async function getTurfs(req, res) {
  try {
    const { sport, city, minRating, maxPrice, featured } = req.query;

    const filter = { approvalStatus: 'Approved' };
    if (sport)      filter.sports      = sport;
    if (city)       filter.city        = new RegExp(city, 'i');
    if (minRating)  filter.averageRating = { $gte: Number(minRating) };
    if (maxPrice)   filter.weekdayPrice  = { $lte: Number(maxPrice) };
    if (featured === 'true') filter.featured = true;

    const turfs = await Turf.find(filter)
      .sort({ featured: -1, averageRating: -1 })
      .lean({ virtuals: true });

    return res.json(turfs.map((t) => turfToFrontend({ toObject: () => t, ...t })));
  } catch (err) {
    console.error('[getTurfs]', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// ─── GET /api/turfs/nearby ────────────────────────────────────────────────────
async function getNearbyTurfs(req, res) {
  try {
    const lat    = parseFloat(req.query.latitude);
    const lng    = parseFloat(req.query.longitude);
    const radius = parseFloat(req.query.radius) || 10; // km

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ message: 'latitude and longitude are required' });
    }

    const turfs = await Turf.find({
      approvalStatus: 'Approved',
      location: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: radius * 1000, // metres
        },
      },
    }).lean({ virtuals: true });

    // Attach distance and estimated travel time to each result
    const results = turfs.map((t) => {
      const tLat = t.location?.coordinates?.[1] ?? 0;
      const tLng = t.location?.coordinates?.[0] ?? 0;
      const distanceKm = haversineKm(lat, lng, tLat, tLng);
      const travelMinutes = Math.round((distanceKm / 30) * 60); // ~30 km/h city speed

      return {
        ...turfToFrontend({ toObject: () => t, ...t }),
        distanceKm: Math.round(distanceKm * 10) / 10,
        travelMinutes,
      };
    });

    return res.json(results);
  } catch (err) {
    console.error('[getNearbyTurfs]', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// ─── GET /api/turfs/:id ───────────────────────────────────────────────────────
async function getTurfById(req, res) {
  try {
    const turf = await Turf.findById(req.params.id).lean({ virtuals: true });
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }

    // Increment view count (fire-and-forget)
    Turf.findByIdAndUpdate(req.params.id, { $inc: { totalViews: 1 } }).exec();

    return res.json(turfToFrontend({ toObject: () => turf, ...turf }));
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid turf ID' });
    }
    console.error('[getTurfById]', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// ─── POST /api/turfs ──────────────────────────────────────────────────────────
async function createTurf(req, res) {
  try {
    const body = req.body || {};

    const turf = await Turf.create({
      turfName:    body.turfName    || body.name,
      ownerName:   body.ownerName   || body.owner,
      ownerId:     req.user?.id,
      email:       body.email,
      phone:       body.phone,
      address:     body.address     || body.addr,
      landmark:    body.landmark,
      area:        body.area,
      city:        body.city,
      state:       body.state,
      country:     body.country,
      pincode:     body.pincode,
      location: {
        type: 'Point',
        coordinates: [
          parseFloat(body.lng || body.longitude || 0),
          parseFloat(body.lat || body.latitude  || 0),
        ],
      },
      googleMapsLink: body.googleMapsLink,
      placeId:        body.placeId,
      sports:         Array.isArray(body.sports) ? body.sports : [],
      venueType:      body.venueType,
      turfType:       body.turfType || body.grassType,
      groundSize:     body.groundSize,
      playerCapacity: body.playerCapacity,
      weekdayPrice:   body.weekdayPrice || body.price,
      weekendPrice:   body.weekendPrice,
      holidayPrice:   body.holidayPrice,
      openingTime:    body.openingTime  || body.open,
      closingTime:    body.closingTime  || body.close,
      amenities:      parseAmenities(body.amenities),
      mainImage:      body.mainImage    || body.image,
      galleryImages:  body.galleryImages || body.gallery || [],
      description:    body.description,
      rules:          body.rules,
      cancellationPolicy: body.cancellationPolicy,
      offer:          body.offer,
      featured:       body.featured || false,
      approvalStatus: req.user?.role === 'admin' ? 'Approved' : 'Pending',
      legacySlots:    Array.isArray(body.slots)       ? body.slots       : [],
      legacyReviews:  Array.isArray(body.reviewsList) ? body.reviewsList : [],
    });

    return res.status(201).json(turfToFrontend(turf));
  } catch (err) {
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map((e) => e.message).join(', ');
      return res.status(400).json({ message: msg });
    }
    console.error('[createTurf]', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// ─── PUT /api/turfs/:id ───────────────────────────────────────────────────────
async function updateTurf(req, res) {
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }

    // Only admin or the owner may update
    const isAdmin = req.user?.role === 'admin';
    const isOwner = turf.ownerId && turf.ownerId.toString() === req.user?.id;
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const body = req.body || {};
    const updates = {};

    if (body.turfName    || body.name)       updates.turfName    = body.turfName    || body.name;
    if (body.ownerName   || body.owner)      updates.ownerName   = body.ownerName   || body.owner;
    if (body.email)                          updates.email       = body.email;
    if (body.phone)                          updates.phone       = body.phone;
    if (body.address     || body.addr)       updates.address     = body.address     || body.addr;
    if (body.area)                           updates.area        = body.area;
    if (body.city)                           updates.city        = body.city;
    if (body.state)                          updates.state       = body.state;
    if (body.pincode)                        updates.pincode     = body.pincode;
    if (body.sports)                         updates.sports      = body.sports;
    if (body.venueType)                      updates.venueType   = body.venueType;
    if (body.turfType    || body.grassType)  updates.turfType    = body.turfType    || body.grassType;
    if (body.groundSize)                     updates.groundSize  = body.groundSize;
    if (body.weekdayPrice || body.price)     updates.weekdayPrice = body.weekdayPrice || body.price;
    if (body.weekendPrice)                   updates.weekendPrice = body.weekendPrice;
    if (body.holidayPrice)                   updates.holidayPrice = body.holidayPrice;
    if (body.openingTime  || body.open)      updates.openingTime = body.openingTime  || body.open;
    if (body.closingTime  || body.close)     updates.closingTime = body.closingTime  || body.close;
    if (body.amenities)                      updates.amenities   = parseAmenities(body.amenities);
    if (body.mainImage    || body.image)     updates.mainImage   = body.mainImage    || body.image;
    if (body.galleryImages || body.gallery)  updates.galleryImages = body.galleryImages || body.gallery;
    if (body.description)                    updates.description = body.description;
    if (body.offer !== undefined)            updates.offer       = body.offer;
    if (body.isVerified   !== undefined)     updates.isVerified  = body.isVerified;
    if (isAdmin && body.approvalStatus)      updates.approvalStatus = body.approvalStatus;
    if (body.slots)                          updates.legacySlots = body.slots;
    if (body.reviewsList)                    updates.legacyReviews = body.reviewsList;

    if ((body.lat || body.latitude) && (body.lng || body.longitude)) {
      updates.location = {
        type: 'Point',
        coordinates: [
          parseFloat(body.lng || body.longitude),
          parseFloat(body.lat || body.latitude),
        ],
      };
    }

    const updated = await Turf.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).lean({ virtuals: true });

    return res.json(turfToFrontend({ toObject: () => updated, ...updated }));
  } catch (err) {
    if (err.name === 'CastError')       return res.status(400).json({ message: 'Invalid turf ID' });
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map((e) => e.message).join(', ');
      return res.status(400).json({ message: msg });
    }
    console.error('[updateTurf]', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// ─── DELETE /api/turfs/:id ────────────────────────────────────────────────────
async function deleteTurf(req, res) {
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }

    const isAdmin = req.user?.role === 'admin';
    const isOwner = turf.ownerId && turf.ownerId.toString() === req.user?.id;
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await Turf.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Turf deleted successfully' });
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid turf ID' });
    console.error('[deleteTurf]', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Parse amenities from various input shapes into the Boolean sub-document.
 * Accepts: array of strings, or already-shaped object.
 */
function parseAmenities(input) {
  if (!input) return {};
  if (Array.isArray(input)) {
    return {
      parking:       input.includes('Parking'),
      washroom:      input.includes('Washroom'),
      changingRoom:  input.includes('Changing Room'),
      shower:        input.includes('Shower'),
      drinkingWater: input.includes('Drinking Water'),
      floodLights:   input.includes('Flood Lights'),
      wifi:          input.includes('WiFi'),
      cafe:          input.includes('Cafe'),
      locker:        input.includes('Locker'),
      firstAid:      input.includes('First Aid'),
      seatingArea:   input.includes('Seating Area'),
    };
  }
  // Already an object
  return input;
}

/**
 * Haversine distance in km.
 */
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

module.exports = {
  getTurfs,
  getNearbyTurfs,
  getTurfById,
  createTurf,
  updateTurf,
  deleteTurf,
};
