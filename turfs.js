(function () {
  const DEFAULT_CENTER = { lat: 28.7041, lng: 77.1025, label: 'Delhi' };
  const FAVORITES_KEY = 'kk_favorite_turfs';
  const INR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

  const LOCATION_OPTIONS = [
    { label: 'Delhi - 110001', lat: 28.7041, lng: 77.1025 },
    { label: 'Connaught Place, Delhi - 110001', lat: 28.6315, lng: 77.2167 },
    { label: 'Rohini, Delhi - 110085', lat: 28.7499, lng: 77.0565 },
    { label: 'Gurugram - 122001', lat: 28.4595, lng: 77.0266 },
    { label: 'Noida - 201301', lat: 28.5355, lng: 77.3910 },
    { label: 'Banswara - 327001', lat: 23.5461, lng: 74.4349 }
  ];

  const AMENITY_ICONS = {
    Parking: 'P',
    'Changing Room': 'CR',
    Shower: 'SH',
    Washroom: 'WC',
    Cafe: 'CF',
    WiFi: 'WF',
    'Flood Lights': 'FL',
    'First Aid': '+',
    'Drinking Water': 'DW',
    Locker: 'LK',
    Indoor: 'IN',
    Outdoor: 'OUT',
    'Artificial Turf': 'AT',
    'Natural Grass': 'NG'
  };

  const DEFAULT_TURFS = [
    {
      id: 1,
      name: 'Greenfield Sports Arena',
      area: 'Stadium Road',
      city: 'Delhi',
      pincode: '110001',
      lat: 28.7041,
      lng: 77.1025,
      addr: 'Near Stadium Road, Delhi',
      phone: '+91 98765 43210',
      owner: 'Aarav Mehta',
      image: 'img/1711879275-image_cropper_1711879253005.webp',
      gallery: [
        'img/1711879275-image_cropper_1711879253005.webp',
        'img/Amaravida-tennis-basket-ball-squash-1-1200.jpg',
        'img/Tennis-Court-Construction_Artificial-Turf.jpg'
      ],
      sports: ['Football', 'Cricket', 'Pickleball'],
      price: 400,
      rating: 4.7,
      reviews: 128,
      open: '06:00',
      close: '23:00',
      verified: true,
      offer: '20% OFF',
      amenities: ['Parking', 'Changing Room', 'Washroom', 'Flood Lights', 'Drinking Water', 'Locker', 'Outdoor', 'Artificial Turf', 'First Aid'],
      groundSize: '7v7 / 11v11',
      venueType: 'Outdoor',
      grassType: 'Artificial Turf',
      slots: [
        { time: '6 PM', available: true },
        { time: '7 PM', available: true },
        { time: '8 PM', available: false },
        { time: '9 PM', available: true }
      ],
      reviewsList: [
        { name: 'Rohan S.', rating: 5, date: 'Today', verified: true, text: 'Clean turf, bright flood lights, and fast check-in.', photos: ['img/1711879275-image_cropper_1711879253005.webp'] },
        { name: 'Meera P.', rating: 4, date: 'Yesterday', verified: true, text: 'Good bounce and helpful staff. Parking gets full after 8 PM.', photos: ['img/Amaravida-tennis-basket-ball-squash-1-1200.jpg'] }
      ]
    },
    {
      id: 2,
      name: 'City Sports Turf',
      area: 'Market Lane',
      city: 'Delhi',
      pincode: '110006',
      lat: 28.7090,
      lng: 77.1150,
      addr: 'Market Lane, Delhi',
      phone: '+91 91234 56789',
      owner: 'Neha Arora',
      image: '(2) Instagram_files/378550182_324054163531194_414513473059086200_n.jpg',
      gallery: [
        '(2) Instagram_files/378550182_324054163531194_414513473059086200_n.jpg',
        'img/Tennis-Court-Construction_Artificial-Turf.jpg',
        'img/Amaravida-tennis-basket-ball-squash-1-1200.jpg'
      ],
      sports: ['Football', 'Badminton', 'Basketball'],
      price: 350,
      rating: 4.5,
      reviews: 96,
      open: '06:00',
      close: '23:30',
      verified: true,
      offer: 'Flat ₹100 OFF',
      amenities: ['Parking', 'Washroom', 'Cafe', 'Flood Lights', 'Drinking Water', 'Outdoor', 'Artificial Turf'],
      groundSize: '5v5 / 7v7',
      venueType: 'Outdoor',
      grassType: 'Artificial Turf',
      slots: [
        { time: '6 PM', available: true },
        { time: '7 PM', available: false },
        { time: '8 PM', available: true },
        { time: '9 PM', available: true }
      ],
      reviewsList: [
        { name: 'Kabir A.', rating: 5, date: '2 days ago', verified: true, text: 'Best value around the area. Basketball court is a bonus.', photos: ['img/Amaravida-tennis-basket-ball-squash-1-1200.jpg'] },
        { name: 'Simran K.', rating: 4, date: 'This week', verified: true, text: 'Smooth booking and easy directions.', photos: ['(2) Instagram_files/378550182_324054163531194_414513473059086200_n.jpg'] }
      ]
    },
    {
      id: 3,
      name: 'Riverside Turf Club',
      area: 'Riverside Park',
      city: 'Delhi',
      pincode: '110054',
      lat: 28.6950,
      lng: 77.0900,
      addr: 'Riverside Park, Delhi',
      phone: '+91 99887 66554',
      owner: 'Dev Malik',
      image: 'img/Tennis-Court-Construction_Artificial-Turf.jpg',
      gallery: [
        'img/Tennis-Court-Construction_Artificial-Turf.jpg',
        'img/1711879275-image_cropper_1711879253005.webp',
        'img/Amaravida-tennis-basket-ball-squash-1-1200.jpg'
      ],
      sports: ['Cricket', 'Badminton', 'Tennis'],
      price: 300,
      rating: 4.2,
      reviews: 74,
      open: '07:00',
      close: '21:00',
      verified: true,
      offer: 'Weekend Discount',
      amenities: ['Changing Room', 'Washroom', 'Drinking Water', 'Cafe', 'Locker', 'Outdoor', 'Natural Grass'],
      groundSize: 'Cricket box / Tennis',
      venueType: 'Outdoor',
      grassType: 'Natural Grass',
      slots: [
        { time: '6 PM', available: false },
        { time: '7 PM', available: true },
        { time: '8 PM', available: false },
        { time: '9 PM', available: false }
      ],
      reviewsList: [
        { name: 'Ananya R.', rating: 4, date: '3 days ago', verified: true, text: 'Peaceful location and great for tennis practice.', photos: ['img/Tennis-Court-Construction_Artificial-Turf.jpg'] },
        { name: 'Sahil T.', rating: 4, date: 'Last week', verified: false, text: 'Good grass, but night slots finish quickly.', photos: [] }
      ]
    },
    {
      id: 4,
      name: 'Sunrise Multi-Sport Turf',
      area: 'Sunrise Avenue',
      city: 'Delhi',
      pincode: '110033',
      lat: 28.7200,
      lng: 77.1000,
      addr: 'Sunrise Avenue, Delhi',
      phone: '+91 90123 45678',
      owner: 'Ritika Jain',
      image: 'img/Amaravida-tennis-basket-ball-squash-1-1200.jpg',
      gallery: [
        'img/Amaravida-tennis-basket-ball-squash-1-1200.jpg',
        'img/Tennis-Court-Construction_Artificial-Turf.jpg',
        'img/1711879275-image_cropper_1711879253005.webp'
      ],
      sports: ['Football', 'Cricket', 'Basketball', 'Tennis'],
      price: 550,
      rating: 4.8,
      reviews: 212,
      open: '09:00',
      close: '20:00',
      verified: true,
      offer: 'Coupon Available',
      amenities: ['Parking', 'Changing Room', 'Shower', 'Cafe', 'WiFi', 'Flood Lights', 'First Aid', 'Indoor', 'Artificial Turf'],
      groundSize: '5v5 / Indoor court',
      venueType: 'Indoor',
      grassType: 'Artificial Turf',
      slots: [
        { time: '6 PM', available: true },
        { time: '7 PM', available: true },
        { time: '8 PM', available: false },
        { time: '9 PM', available: false }
      ],
      reviewsList: [
        { name: 'Nikhil M.', rating: 5, date: 'Today', verified: true, text: 'Premium feel, indoor court saved us from rain.', photos: ['img/Amaravida-tennis-basket-ball-squash-1-1200.jpg'] },
        { name: 'Tara B.', rating: 5, date: 'This week', verified: true, text: 'Clean changing rooms and quick UPI payment.', photos: ['img/Tennis-Court-Construction_Artificial-Turf.jpg'] }
      ]
    },
    {
      id: 5,
      name: 'Valley Cricket Turf',
      area: 'Valley Street',
      city: 'Delhi',
      pincode: '110088',
      lat: 28.7105,
      lng: 77.1300,
      addr: 'Valley Street, Delhi',
      phone: '+91 90909 09090',
      owner: 'Harsh Vora',
      image: 'img/1711879275-image_cropper_1711879253005.webp',
      gallery: [
        'img/1711879275-image_cropper_1711879253005.webp',
        '(2) Instagram_files/378550182_324054163531194_414513473059086200_n.jpg',
        'img/Tennis-Court-Construction_Artificial-Turf.jpg'
      ],
      sports: ['Cricket', 'Football'],
      price: 250,
      rating: 4.1,
      reviews: 58,
      open: '08:00',
      close: '22:00',
      verified: false,
      offer: '₹50 OFF',
      amenities: ['Parking', 'Washroom', 'Drinking Water', 'Outdoor', 'Natural Grass'],
      groundSize: 'Cricket box',
      venueType: 'Outdoor',
      grassType: 'Natural Grass',
      slots: [
        { time: '6 PM', available: false },
        { time: '7 PM', available: false },
        { time: '8 PM', available: false },
        { time: '9 PM', available: false }
      ],
      reviewsList: [
        { name: 'Yash D.', rating: 4, date: 'Yesterday', verified: true, text: 'Simple, affordable, and good for cricket practice.', photos: ['img/1711879275-image_cropper_1711879253005.webp'] },
        { name: 'Pooja N.', rating: 3, date: 'Last week', verified: false, text: 'Nice price, but book earlier for evening slots.', photos: [] }
      ]
    }
  ];

  const state = {
    allTurfs: [],
    visibleTurfs: [],
    favorites: new Set(),
    favoriteSports: new Set(),
    userLocation: null,
    activeView: 'list',
    activeTurfId: null,
    map: null,
    markerLayer: null,
    markers: new Map(),
    currentLocationMarker: null,
    booking: { turfId: null, step: 0, slot: null },
    detailTurfId: null,
    shareTurfId: null
  };

  const refs = {
    search: byId('search'),
    searchSuggestions: byId('searchSuggestions'),
    locationSuggestions: byId('locationSuggestions'),
    manualLocationPanel: byId('manualLocationPanel'),
    manualLocation: byId('manualLocation'),
    manualLocationBtn: byId('manualLocationBtn'),
    findBtn: byId('findBtn'),
    filterToggle: byId('filterToggle'),
    filtersPanel: byId('filtersPanel'),
    resetFilters: byId('resetFilters'),
    status: byId('status'),
    weatherCard: byId('weatherCard'),
    resultTitle: byId('resultTitle'),
    resultMeta: byId('resultMeta'),
    sortSelect: byId('sortSelect'),
    favoritesOnly: byId('favoritesOnly'),
    loadingSkeleton: byId('loadingSkeleton'),
    list: byId('list'),
    emptyState: byId('emptyState'),
    emptySearchAgain: byId('emptySearchAgain'),
    expandRadius: byId('expandRadius'),
    listPanel: byId('listPanel'),
    mapPanel: byId('mapPanel'),
    map: byId('map'),
    recommendations: byId('recommendations'),
    bookingModal: byId('bookingModal'),
    bookingTitle: byId('bookingTitle'),
    bookingSubtitle: byId('bookingSubtitle'),
    bookingDate: byId('bookingDate'),
    bookingSlots: byId('bookingSlots'),
    bookingDuration: byId('bookingDuration'),
    bookingPlayers: byId('bookingPlayers'),
    couponInput: byId('couponInput'),
    paymentSummary: byId('paymentSummary'),
    confirmationText: byId('confirmationText'),
    bookingBack: byId('bookingBack'),
    bookingNext: byId('bookingNext'),
    detailModal: byId('detailModal'),
    detailContent: byId('detailContent'),
    shareModal: byId('shareModal'),
    shareTitle: byId('shareTitle'),
    shareSubtitle: byId('shareSubtitle'),
    shareWhatsApp: byId('shareWhatsApp'),
    shareFacebook: byId('shareFacebook'),
    shareInstagram: byId('shareInstagram'),
    copyShareLink: byId('copyShareLink'),
    shareFeedback: byId('shareFeedback'),
    mobileBookingBar: byId('mobileBookingBar'),
    mobileTurfName: byId('mobileTurfName'),
    mobileTurfPrice: byId('mobileTurfPrice'),
    mobileBookBtn: byId('mobileBookBtn')
  };

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    bindNavigation();
    bindControls();
    setDateDefaults();
    loadFavorites();
    renderWeather();
    showSkeleton(true);

    state.allTurfs = await loadTurfs();
    buildSuggestions();
    applyFilters();
    showSkeleton(false);
    requestUserLocation(true);
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function createElement(tag, options) {
    const element = document.createElement(tag);
    const opts = options || {};
    if (opts.className) element.className = opts.className;
    if (opts.text !== undefined) element.textContent = opts.text;
    if (opts.attrs) {
      Object.entries(opts.attrs).forEach(([key, value]) => {
        if (value !== undefined && value !== null) element.setAttribute(key, value);
      });
    }
    if (opts.children) element.append(...opts.children.filter(Boolean));
    return element;
  }

  function safeText(value, fallback) {
    return String(value || fallback || '');
  }

  function escapeHtml(value) {
    return safeText(value).replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[ch]));
  }

  function bindNavigation() {
    const button = document.querySelector('.hamburger');
    const nav = document.getElementById(button && button.getAttribute('aria-controls'));
    if (!button || !nav) return;

    button.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      button.setAttribute('aria-expanded', String(isOpen));
    });
  }

  function bindControls() {
    refs.findBtn.addEventListener('click', () => requestUserLocation(false));
    refs.manualLocationBtn.addEventListener('click', setManualLocation);
    refs.search.addEventListener('input', debounce(applyFilters, 120));
    refs.sortSelect.addEventListener('change', applyFilters);
    refs.filterToggle.addEventListener('click', toggleFilters);
    refs.resetFilters.addEventListener('click', resetFilters);
    refs.favoritesOnly.addEventListener('click', toggleFavoritesOnly);
    refs.emptySearchAgain.addEventListener('click', () => requestUserLocation(false));
    refs.expandRadius.addEventListener('click', expandSearchRadius);
    refs.mobileBookBtn.addEventListener('click', () => {
      const turf = state.visibleTurfs[0];
      if (turf) openBooking(turf.id);
    });

    document.querySelectorAll('[data-view]').forEach((button) => {
      button.addEventListener('click', () => switchView(button.dataset.view));
    });

    refs.filtersPanel.addEventListener('change', applyFilters);
    refs.bookingBack.addEventListener('click', () => setBookingStep(state.booking.step - 1));
    refs.bookingNext.addEventListener('click', handleBookingNext);
    refs.bookingDate.addEventListener('change', refreshBookingSlots);
    refs.bookingDuration.addEventListener('change', renderPaymentSummary);
    refs.bookingPlayers.addEventListener('input', renderPaymentSummary);
    refs.couponInput.addEventListener('input', renderPaymentSummary);

    document.querySelectorAll('[data-close-modal]').forEach((button) => {
      button.addEventListener('click', closeBooking);
    });
    document.querySelectorAll('[data-close-details]').forEach((button) => {
      button.addEventListener('click', closeDetails);
    });
    document.querySelectorAll('[data-close-share]').forEach((button) => {
      button.addEventListener('click', closeShare);
    });

    refs.bookingModal.addEventListener('click', (event) => {
      if (event.target === refs.bookingModal) closeBooking();
    });
    refs.detailModal.addEventListener('click', (event) => {
      if (event.target === refs.detailModal) closeDetails();
    });
    refs.shareModal.addEventListener('click', (event) => {
      if (event.target === refs.shareModal) closeShare();
    });

    refs.copyShareLink.addEventListener('click', copyShareLink);
    document.addEventListener('keydown', handleEscape);
  }

  async function loadTurfs() {
    try {
      const response = await fetch('turfs.json');
      if (!response.ok) throw new Error('Unable to load turfs.json');
      const fetched = await response.json();
      return mergeFetchedTurfs(Array.isArray(fetched) ? fetched : []);
    } catch (err) {
      console.warn('Using built-in turf data because turfs.json could not be loaded.', err);
      return DEFAULT_TURFS.map(normalizeTurf);
    }
  }

  function mergeFetchedTurfs(fetched) {
    const byId = new Map(fetched.map((item) => [String(item.id || item.name), item]));
    const merged = DEFAULT_TURFS.map((base) => normalizeTurf({
      ...base,
      ...(byId.get(String(base.id)) || byId.get(base.name) || {})
    }));

    fetched.forEach((item, index) => {
      const alreadyKnown = DEFAULT_TURFS.some((base) => String(base.id) === String(item.id) || base.name === item.name);
      if (!alreadyKnown) {
        merged.push(normalizeTurf({
          ...DEFAULT_TURFS[index % DEFAULT_TURFS.length],
          ...item,
          id: item.id || `custom-${index}`
        }));
      }
    });

    return merged.map(addSearchText);
  }

  function normalizeTurf(turf) {
    return {
      ...turf,
      area: turf.area || getAreaFromAddress(turf.addr),
      city: turf.city || 'Delhi',
      pincode: turf.pincode || '110001',
      sports: Array.isArray(turf.sports) ? turf.sports : ['Football', 'Cricket'],
      amenities: Array.isArray(turf.amenities) ? turf.amenities : ['Parking', 'Washroom', 'Drinking Water', 'Outdoor', 'Artificial Turf'],
      gallery: Array.isArray(turf.gallery) ? turf.gallery : [turf.image || DEFAULT_TURFS[0].image],
      slots: Array.isArray(turf.slots) ? turf.slots : DEFAULT_TURFS[0].slots,
      reviewsList: Array.isArray(turf.reviewsList) ? turf.reviewsList : DEFAULT_TURFS[0].reviewsList,
      image: turf.image || DEFAULT_TURFS[0].image,
      price: Number(turf.price || 300),
      rating: Number(turf.rating || 4.3),
      reviews: Number(turf.reviews || 42),
      open: turf.open || '08:00',
      close: turf.close || '22:00',
      owner: turf.owner || 'Khela Kya Partner',
      groundSize: turf.groundSize || '5v5 / 7v7',
      venueType: turf.venueType || (turf.amenities && turf.amenities.includes('Indoor') ? 'Indoor' : 'Outdoor'),
      grassType: turf.grassType || 'Artificial Turf'
    };
  }

  function getAreaFromAddress(address) {
    return safeText(address).split(',')[0] || 'Nearby Area';
  }

  function addSearchText(turf) {
    const values = [
      turf.name,
      turf.area,
      turf.city,
      turf.pincode,
      turf.addr,
      turf.sports.join(' '),
      turf.amenities.join(' ')
    ];
    return { ...turf, searchText: values.join(' ').toLowerCase() };
  }

  function buildSuggestions() {
    const searchValues = new Set();
    state.allTurfs.forEach((turf) => {
      [turf.name, turf.area, turf.city, turf.pincode, turf.addr, ...turf.sports].forEach((value) => {
        if (value) searchValues.add(value);
      });
    });
    renderDatalist(refs.searchSuggestions, Array.from(searchValues).sort());

    const locationValues = new Set(LOCATION_OPTIONS.map((location) => location.label));
    state.allTurfs.forEach((turf) => locationValues.add(`${turf.area}, ${turf.city} - ${turf.pincode}`));
    renderDatalist(refs.locationSuggestions, Array.from(locationValues).sort());
  }

  function renderDatalist(target, values) {
    target.replaceChildren(...values.map((value) => createElement('option', { attrs: { value } })));
  }

  function requestUserLocation(isAutoRequest) {
    if (!navigator.geolocation) {
      setStatus('Location is not supported in this browser. Search manually instead.');
      showManualLocation();
      return;
    }

    setStatus(isAutoRequest ? 'Requesting location permission...' : 'Locating you...');
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      state.userLocation = { lat: latitude, lng: longitude, label: 'Current location' };
      refs.manualLocationPanel.hidden = true;
      setStatus(`Current location found: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      renderWeather();
      applyFilters();
    }, () => {
      state.userLocation = null;
      setStatus('Location permission was denied. Enter an area, city, or pincode to continue.');
      showManualLocation();
      renderWeather();
      applyFilters();
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
  }

  function showManualLocation() {
    refs.manualLocationPanel.hidden = false;
    refs.manualLocation.focus();
  }

  function setManualLocation() {
    const query = safeText(refs.manualLocation.value).toLowerCase().trim();
    if (!query) {
      setStatus('Type a city, area, or pincode first.');
      return;
    }

    const turfMatch = state.allTurfs.find((turf) => (
      turf.name.toLowerCase().includes(query) ||
      turf.area.toLowerCase().includes(query) ||
      turf.city.toLowerCase().includes(query) ||
      turf.pincode.includes(query)
    ));
    const optionMatch = LOCATION_OPTIONS.find((location) => location.label.toLowerCase().includes(query));
    const location = turfMatch
      ? { lat: turfMatch.lat, lng: turfMatch.lng, label: `${turfMatch.area}, ${turfMatch.city}` }
      : optionMatch;

    if (!location) {
      setStatus('No matching manual location found. Try Delhi, Gurugram, Noida, or a turf area.');
      return;
    }

    state.userLocation = location;
    setStatus(`Manual location set: ${location.label}`);
    renderWeather();
    applyFilters();
  }

  function setStatus(message) {
    refs.status.textContent = message;
  }

  function renderWeather() {
    if (!state.userLocation) {
      refs.weatherCard.textContent = 'Set location for weather and travel time.';
      return;
    }

    const seed = Math.abs(Math.round((state.userLocation.lat + state.userLocation.lng) * 10));
    const temperature = 27 + (seed % 8);
    const rain = (seed * 7) % 56;
    const recommendation = rain > 40 ? 'Rain expected. Consider indoor turf.' : 'Perfect for outdoor play.';
    refs.weatherCard.textContent = `${temperature}°C · ${rain}% rain · ${recommendation}`;
  }

  function collectFilters() {
    return {
      query: safeText(refs.search.value).toLowerCase().trim(),
      sports: getCheckedValues('sports'),
      amenities: getCheckedValues('amenities'),
      price: getRadioValue('priceFilter'),
      distance: getRadioValue('distanceFilter'),
      rating4: byId('ratingFilter').checked,
      availableNow: byId('availableNowFilter').checked,
      availableToday: byId('availableTodayFilter').checked,
      favoritesOnly: refs.favoritesOnly.getAttribute('aria-pressed') === 'true'
    };
  }

  function getCheckedValues(groupName) {
    return Array.from(document.querySelectorAll(`[data-filter-group="${groupName}"] input:checked`)).map((input) => input.value);
  }

  function getRadioValue(name) {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : 'all';
  }

  function applyFilters() {
    const filters = collectFilters();
    let items = decorateDistances(state.allTurfs);

    if (filters.query) {
      items = items.filter((turf) => turf.searchText.includes(filters.query));
    }
    if (filters.sports.length) {
      items = items.filter((turf) => filters.sports.every((sport) => turf.sports.includes(sport)));
    }
    if (filters.amenities.length) {
      items = items.filter((turf) => filters.amenities.every((amenity) => turf.amenities.includes(amenity)));
    }
    if (filters.price !== 'all') {
      items = items.filter((turf) => matchesPrice(turf.price, filters.price));
    }
    if (filters.distance !== 'all' && state.userLocation) {
      const maxDistance = Number(filters.distance);
      items = items.filter((turf) => turf.distanceKm <= maxDistance);
    }
    if (filters.rating4) {
      items = items.filter((turf) => turf.rating >= 4);
    }
    if (filters.availableNow) {
      items = items.filter((turf) => isOpenNow(turf) && turf.slots.some((slot) => slot.available));
    }
    if (filters.availableToday) {
      items = items.filter((turf) => turf.slots.some((slot) => slot.available));
    }
    if (filters.favoritesOnly) {
      items = items.filter((turf) => state.favorites.has(String(turf.id)));
    }

    items.sort(getSortComparator(refs.sortSelect.value));
    state.visibleTurfs = items;
    state.activeTurfId = items[0] ? items[0].id : null;

    renderResults(items);
    renderMap(items);
    renderRecommendations();
    updateMobileBookingBar();
  }

  function decorateDistances(turfs) {
    return turfs.map((turf) => {
      if (!state.userLocation) {
        return { ...turf, distanceKm: null, travelMinutes: null };
      }
      const distanceKm = distanceBetween(state.userLocation.lat, state.userLocation.lng, turf.lat, turf.lng);
      return {
        ...turf,
        distanceKm,
        travelMinutes: estimateTravelMinutes(distanceKm)
      };
    });
  }

  function matchesPrice(price, filter) {
    if (filter === '100-300') return price >= 100 && price <= 300;
    if (filter === '300-500') return price > 300 && price <= 500;
    if (filter === '500+') return price > 500;
    return true;
  }

  function getSortComparator(sortKey) {
    if (sortKey === 'rating') return (a, b) => b.rating - a.rating || b.reviews - a.reviews;
    if (sortKey === 'price') return (a, b) => a.price - b.price;
    return (a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999) || b.rating - a.rating;
  }

  function renderResults(items) {
    refs.resultTitle.textContent = items.length ? `${items.length} turfs found` : 'No matching turfs';
    refs.resultMeta.textContent = state.userLocation
      ? `Sorted near ${state.userLocation.label}. Click a card to highlight it on the map.`
      : 'Set a location to unlock distance, ETA, and nearest-first sorting.';

    refs.list.replaceChildren();
    refs.emptyState.hidden = items.length > 0;

    if (!items.length) return;
    refs.list.append(...items.map(renderTurfCard));
    markActiveCard();
  }

  function renderTurfCard(turf) {
    const card = createElement('article', {
      className: 'turf-card',
      attrs: { tabindex: '0', 'data-turf-id': turf.id, 'aria-label': `${turf.name}, ${turf.price} rupees per hour` }
    });

    const heroImage = createElement('img', {
      attrs: {
        src: turf.image,
        alt: `${turf.name} turf`,
        loading: 'lazy'
      }
    });
    const gallery = createElement('div', { className: 'gallery-strip' });
    gallery.append(...turf.gallery.slice(0, 3).map((src) => createElement('img', {
      attrs: { src, alt: `${turf.name} gallery preview`, loading: 'lazy' }
    })));
    const media = createElement('div', {
      className: 'turf-media',
      children: [
        heroImage,
        turf.offer ? createElement('span', { className: 'offer-badge', text: turf.offer }) : null,
        gallery
      ]
    });

    const title = createElement('div', { className: 'card-title' });
    title.append(
      createElement('h3', { text: turf.name }),
      turf.verified ? createElement('span', { className: 'verified-badge', text: 'Verified' }) : null
    );

    const favoriteButton = createElement('button', {
      className: `icon-action ${state.favorites.has(String(turf.id)) ? 'active' : ''}`,
      text: state.favorites.has(String(turf.id)) ? '♥' : '♡',
      attrs: { type: 'button', 'aria-label': `Save ${turf.name}`, 'aria-pressed': String(state.favorites.has(String(turf.id))) }
    });
    favoriteButton.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleFavorite(turf.id);
    });

    const shareButton = createElement('button', {
      className: 'icon-action',
      text: '↗',
      attrs: { type: 'button', 'aria-label': `Share ${turf.name}` }
    });
    shareButton.addEventListener('click', (event) => {
      event.stopPropagation();
      openShare(turf.id);
    });

    const meta = createElement('div', {
      className: 'turf-meta',
      children: [
        createElement('span', { text: `★ ${turf.rating} (${turf.reviews} reviews)` }),
        createElement('span', { text: formatDistance(turf) }),
        createElement('span', { text: formatTravelTime(turf) })
      ]
    });

    const content = createElement('div', { className: 'turf-content' });
    content.append(
      createElement('div', {
        className: 'card-topline',
        children: [
          title,
          createElement('div', { className: 'icon-actions', children: [favoriteButton, shareButton] })
        ]
      }),
      meta,
      createElement('p', { className: 'turf-address', text: `${turf.addr} · ${turf.city} ${turf.pincode}` }),
      renderChips(turf.sports, 'sport-chip'),
      renderPriceStatus(turf),
      renderSlots(turf),
      renderAmenities(turf.amenities),
      renderCardActions(turf)
    );

    card.append(media, content);
    card.addEventListener('mouseenter', () => setActiveTurf(turf.id, false));
    card.addEventListener('focus', () => setActiveTurf(turf.id, false));
    card.addEventListener('click', (event) => {
      if (event.target.closest('button,a')) return;
      setActiveTurf(turf.id, true);
    });
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') openDetails(turf.id);
    });

    return card;
  }

  function renderChips(values, className) {
    return createElement('div', {
      className: className === 'sport-chip' ? 'sport-row' : 'amenities-row',
      children: values.map((value) => createElement('span', { className, text: value }))
    });
  }

  function renderAmenities(amenities) {
    return createElement('div', {
      className: 'amenities-row',
      children: amenities.slice(0, 8).map((amenity) => {
        const icon = AMENITY_ICONS[amenity] || amenity.slice(0, 2).toUpperCase();
        return createElement('span', { className: 'amenity-chip', text: `${icon} ${amenity}` });
      })
    });
  }

  function renderPriceStatus(turf) {
    const status = getLiveStatus(turf);
    return createElement('div', {
      className: 'price-status',
      children: [
        createElement('span', { className: 'price', text: `${INR.format(turf.price)}/hr` }),
        createElement('span', { className: `status-badge ${status.kind === 'warn' ? 'warn' : ''}`, text: status.label }),
        createElement('span', { className: 'muted-small', text: `Next: ${getNextAvailableSlot(turf)}` })
      ]
    });
  }

  function renderSlots(turf) {
    const row = createElement('div', { className: 'slots-row' });
    turf.slots.forEach((slot) => {
      const button = createElement('button', {
        className: `slot-pill ${slot.available ? '' : 'unavailable'}`,
        text: `${slot.time} ${slot.available ? '✓' : '✕'}`,
        attrs: { type: 'button', disabled: slot.available ? null : 'disabled', 'aria-label': `${slot.time} ${slot.available ? 'available' : 'unavailable'}` }
      });
      if (slot.available) {
        button.addEventListener('click', (event) => {
          event.stopPropagation();
          openBooking(turf.id, slot.time);
        });
      }
      row.appendChild(button);
    });
    return row;
  }

  function renderCardActions(turf) {
    const book = createElement('button', { className: 'premium-btn', text: 'Book Now', attrs: { type: 'button' } });
    book.addEventListener('click', (event) => {
      event.stopPropagation();
      openBooking(turf.id);
    });

    const directions = createElement('a', {
      className: 'ghost-btn',
      text: 'Directions',
      attrs: { href: getDirectionsUrl(turf), target: '_blank', rel: 'noopener' }
    });
    directions.addEventListener('click', (event) => event.stopPropagation());

    const details = createElement('button', { className: 'ghost-btn', text: 'View Details', attrs: { type: 'button' } });
    details.addEventListener('click', (event) => {
      event.stopPropagation();
      openDetails(turf.id);
    });

    return createElement('div', { className: 'turf-actions', children: [book, directions, details] });
  }

  function showSkeleton(show) {
    refs.loadingSkeleton.hidden = !show;
    refs.listPanel.hidden = show;
  }

  function switchView(view) {
    state.activeView = view;
    document.querySelectorAll('[data-view]').forEach((button) => {
      const selected = button.dataset.view === view;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-selected', String(selected));
    });
    refs.listPanel.hidden = view !== 'list';
    refs.mapPanel.hidden = view !== 'map';
    if (view === 'map') {
      ensureMap();
      setTimeout(() => {
        if (state.map) state.map.invalidateSize();
        renderMap(state.visibleTurfs);
      }, 50);
    }
  }

  function ensureMap() {
    if (state.map || !window.L || !refs.map) return;
    state.map = L.map(refs.map, { center: [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], zoom: 12, scrollWheelZoom: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(state.map);
  }

  function renderMap(items) {
    ensureMap();
    if (!state.map) return;

    if (state.markerLayer) {
      state.map.removeLayer(state.markerLayer);
    }
    state.markers.clear();
    state.markerLayer = window.L.markerClusterGroup ? L.markerClusterGroup() : L.layerGroup();

    items.forEach((turf) => {
      if (typeof turf.lat !== 'number' || typeof turf.lng !== 'number') return;
      const marker = L.marker([turf.lat, turf.lng]);
      marker.bindPopup(getPopupHtml(turf));
      marker.on('click', () => setActiveTurf(turf.id, false));
      state.markerLayer.addLayer(marker);
      state.markers.set(String(turf.id), marker);
    });

    state.markerLayer.addTo(state.map);
    renderCurrentLocationMarker();

    const layers = state.markerLayer.getLayers ? state.markerLayer.getLayers() : [];
    if (layers.length) {
      state.map.fitBounds(state.markerLayer.getBounds(), { padding: [36, 36] });
    } else if (state.userLocation) {
      state.map.setView([state.userLocation.lat, state.userLocation.lng], 13);
    }
  }

  function renderCurrentLocationMarker() {
    if (!state.map || !state.userLocation) return;
    if (state.currentLocationMarker) {
      state.map.removeLayer(state.currentLocationMarker);
    }
    state.currentLocationMarker = L.circleMarker([state.userLocation.lat, state.userLocation.lng], {
      radius: 8,
      color: '#1b75bb',
      fillColor: '#1b75bb',
      fillOpacity: .85,
      weight: 2
    }).bindPopup('Current location').addTo(state.map);
  }

  function getPopupHtml(turf) {
    return [
      `<strong>${escapeHtml(turf.name)}</strong>`,
      `${escapeHtml(turf.addr)}`,
      `★ ${escapeHtml(turf.rating)} · ${escapeHtml(formatDistance(turf))}`,
      `${escapeHtml(getLiveStatus(turf).label)} · ${escapeHtml(INR.format(turf.price))}/hr`,
      `<a href="${escapeHtml(getDirectionsUrl(turf))}" target="_blank" rel="noopener">Open live route in Google Maps</a>`
    ].join('<br>');
  }

  function setActiveTurf(id, openMap) {
    state.activeTurfId = id;
    markActiveCard();
    const marker = state.markers.get(String(id));
    if (marker) {
      marker.setZIndexOffset(1000);
      marker.openPopup();
      if (state.map && openMap) {
        const turf = getTurfById(id);
        switchView('map');
        state.map.setView([turf.lat, turf.lng], 15);
      }
    }
  }

  function markActiveCard() {
    document.querySelectorAll('.turf-card').forEach((card) => {
      card.classList.toggle('active', card.dataset.turfId === String(state.activeTurfId));
    });
  }

  function renderRecommendations() {
    const scored = decorateDistances(state.allTurfs).map((turf) => {
      const sportBonus = turf.sports.some((sport) => state.favoriteSports.has(sport)) ? .5 : 0;
      const favoriteBonus = state.favorites.has(String(turf.id)) ? .4 : 0;
      const distancePenalty = turf.distanceKm ? Math.min(turf.distanceKm / 20, .7) : 0;
      return { ...turf, score: turf.rating + (turf.reviews / 300) + sportBonus + favoriteBonus - distancePenalty };
    }).sort((a, b) => b.score - a.score).slice(0, 3);

    refs.recommendations.replaceChildren(...scored.map((turf) => {
      const card = createElement('article', { className: 'recommendation-card' });
      const book = createElement('button', { className: 'ghost-btn', text: `Book ${INR.format(turf.price)}/hr`, attrs: { type: 'button' } });
      book.addEventListener('click', () => openBooking(turf.id));
      card.append(
        createElement('strong', { text: turf.name }),
        createElement('span', { className: 'muted-small', text: `★ ${turf.rating} · ${formatDistance(turf)} · ${turf.sports.slice(0, 2).join(', ')}` }),
        book
      );
      return card;
    }));
  }

  function toggleFavorite(id) {
    const key = String(id);
    const turf = getTurfById(id);
    if (state.favorites.has(key)) {
      state.favorites.delete(key);
    } else {
      state.favorites.add(key);
      turf.sports.forEach((sport) => state.favoriteSports.add(sport));
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(state.favorites)));
    applyFilters();
  }

  function loadFavorites() {
    try {
      state.favorites = new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]').map(String));
    } catch (err) {
      state.favorites = new Set();
    }
  }

  function toggleFavoritesOnly() {
    const next = refs.favoritesOnly.getAttribute('aria-pressed') !== 'true';
    refs.favoritesOnly.setAttribute('aria-pressed', String(next));
    refs.favoritesOnly.classList.toggle('active', next);
    applyFilters();
  }

  function toggleFilters() {
    const isOpen = refs.filtersPanel.classList.toggle('open');
    refs.filterToggle.setAttribute('aria-expanded', String(isOpen));
  }

  function resetFilters() {
    refs.search.value = '';
    refs.filtersPanel.querySelectorAll('input[type="checkbox"]').forEach((input) => { input.checked = false; });
    document.querySelector('input[name="priceFilter"][value="all"]').checked = true;
    document.querySelector('input[name="distanceFilter"][value="all"]').checked = true;
    refs.favoritesOnly.setAttribute('aria-pressed', 'false');
    refs.favoritesOnly.classList.remove('active');
    applyFilters();
  }

  function expandSearchRadius() {
    document.querySelector('input[name="distanceFilter"][value="all"]').checked = true;
    applyFilters();
  }

  function updateMobileBookingBar() {
    const turf = state.visibleTurfs[0];
    refs.mobileBookingBar.hidden = !turf;
    if (!turf) return;
    refs.mobileTurfName.textContent = turf.name;
    refs.mobileTurfPrice.textContent = `Book Now ${INR.format(turf.price)}/hr`;
  }

  function openBooking(id, slotTime) {
    const turf = getTurfById(id);
    if (!turf) return;
    state.booking = { turfId: id, step: 0, slot: slotTime || getFirstAvailableSlot(turf) };
    refs.bookingTitle.textContent = `Book ${turf.name}`;
    refs.bookingSubtitle.textContent = `${turf.addr} · ${INR.format(turf.price)}/hr`;
    refs.bookingDate.value = getTodayIso();
    refs.couponInput.value = '';
    refs.bookingDuration.value = '1';
    refs.bookingPlayers.value = '10';
    refreshBookingSlots();
    setBookingStep(0);
    refs.bookingModal.hidden = false;
  }

  function closeBooking() {
    refs.bookingModal.hidden = true;
  }

  function refreshBookingSlots() {
    const turf = getTurfById(state.booking.turfId);
    if (!turf) return;
    refs.bookingSlots.replaceChildren();
    turf.slots.forEach((slot) => {
      const button = createElement('button', {
        className: `slot-pill ${slot.available ? '' : 'unavailable'} ${state.booking.slot === slot.time ? 'active' : ''}`,
        text: slot.time,
        attrs: { type: 'button', disabled: slot.available ? null : 'disabled' }
      });
      if (slot.available) {
        button.addEventListener('click', () => {
          state.booking.slot = slot.time;
          refreshBookingSlots();
          renderPaymentSummary();
        });
      }
      refs.bookingSlots.appendChild(button);
    });
    renderPaymentSummary();
  }

  function setBookingStep(step) {
    state.booking.step = Math.max(0, Math.min(2, step));
    document.querySelectorAll('[data-booking-step]').forEach((panel) => {
      panel.classList.toggle('active', Number(panel.dataset.bookingStep) === state.booking.step);
    });
    document.querySelectorAll('[data-step-indicator]').forEach((indicator) => {
      indicator.classList.toggle('active', Number(indicator.dataset.stepIndicator) <= state.booking.step);
    });
    refs.bookingBack.hidden = state.booking.step === 0;
    refs.bookingNext.textContent = state.booking.step === 0 ? 'Continue' : state.booking.step === 1 ? 'Confirm Booking' : 'Done';
    if (state.booking.step === 1) renderPaymentSummary();
    if (state.booking.step === 2) renderConfirmation();
  }

  function handleBookingNext() {
    if (state.booking.step === 0 && !state.booking.slot) {
      setStatus('Choose an available slot to continue.');
      return;
    }
    if (state.booking.step === 2) {
      closeBooking();
      return;
    }
    setBookingStep(state.booking.step + 1);
  }

  function renderPaymentSummary() {
    const turf = getTurfById(state.booking.turfId);
    if (!turf) return;
    const duration = Number(refs.bookingDuration.value || 1);
    const players = Number(refs.bookingPlayers.value || 1);
    const subtotal = turf.price * duration;
    const coupon = safeText(refs.couponInput.value).trim().toUpperCase();
    const discount = coupon === 'PLAY20' ? Math.round(subtotal * .2) : coupon === 'FLAT100' ? Math.min(100, subtotal) : 0;
    const serviceFee = 30;
    const total = Math.max(0, subtotal - discount + serviceFee);

    refs.paymentSummary.replaceChildren(
      summaryLine('Turf', turf.name),
      summaryLine('Date', formatDate(refs.bookingDate.value)),
      summaryLine('Time', state.booking.slot || 'Select a slot'),
      summaryLine('Duration', `${duration} hour${duration > 1 ? 's' : ''}`),
      summaryLine('Players', `${players}`),
      summaryLine('Subtotal', INR.format(subtotal)),
      summaryLine('Discount', discount ? `-${INR.format(discount)}` : 'No coupon applied'),
      summaryLine('Service fee', INR.format(serviceFee)),
      summaryLine('Payable now', INR.format(total), true)
    );
  }

  function summaryLine(label, value, total) {
    return createElement('div', {
      className: `summary-line ${total ? 'total' : ''}`,
      children: [
        createElement('span', { text: label }),
        createElement('strong', { text: value })
      ]
    });
  }

  function renderConfirmation() {
    const turf = getTurfById(state.booking.turfId);
    if (!turf) return;
    refs.confirmationText.textContent = `${turf.name} is reserved for ${formatDate(refs.bookingDate.value)} at ${state.booking.slot}. Directions and venue contact are available in the details panel.`;
  }

  function openDetails(id) {
    const turf = getTurfById(id);
    if (!turf) return;
    state.detailTurfId = id;
    refs.detailModal.hidden = false;
    renderDetails(turf, 'newest');
  }

  function closeDetails() {
    refs.detailModal.hidden = true;
  }

  function renderDetails(turf, sortMode) {
    const header = createElement('div', { className: 'detail-hero' });
    header.append(
      createElement('img', { attrs: { src: turf.image, alt: `${turf.name} detail image`, loading: 'lazy' } }),
      createElement('div', {
        children: [
          createElement('p', { className: 'eyebrow', text: turf.verified ? 'Verified turf' : 'Partner turf' }),
          createElement('h2', { attrs: { id: 'detailTitle' }, text: turf.name }),
          createElement('p', { className: 'muted-small', text: `${turf.addr} · ${formatDistance(turf)} · ${formatTravelTime(turf)}` }),
          renderPriceStatus(turf),
          renderChips(turf.sports, 'sport-chip'),
          renderAmenities(turf.amenities)
        ]
      })
    );

    const details = createElement('div', { className: 'detail-grid' });
    [
      ['Ground size', turf.groundSize],
      ['Type', turf.venueType],
      ['Grass', turf.grassType],
      ['Opening hours', `${to12Hour(turf.open)} - ${to12Hour(turf.close)}`],
      ['Owner', turf.owner],
      ['Contact', turf.phone || 'Available after booking']
    ].forEach(([label, value]) => {
      details.append(createElement('div', {
        className: 'detail-item',
        children: [
          createElement('span', { className: 'muted-small', text: label }),
          createElement('strong', { text: value })
        ]
      }));
    });

    const reviewSort = createElement('select', { attrs: { 'aria-label': 'Sort reviews' } });
    [
      ['newest', 'Newest'],
      ['highest', 'Highest Rated'],
      ['lowest', 'Lowest Rated']
    ].forEach(([value, label]) => {
      const option = createElement('option', { text: label, attrs: { value } });
      option.selected = value === sortMode;
      reviewSort.appendChild(option);
    });
    reviewSort.addEventListener('change', () => renderDetails(turf, reviewSort.value));

    const reviews = createElement('section');
    reviews.append(
      createElement('div', {
        className: 'review-toolbar',
        children: [
          createElement('div', {
            children: [
              createElement('p', { className: 'eyebrow', text: 'Reviews' }),
              createElement('h3', { text: `${turf.rating}/5 from ${turf.reviews} reviews` })
            ]
          }),
          reviewSort
        ]
      }),
      renderReviews(turf, sortMode)
    );

    const actions = createElement('div', {
      className: 'turf-actions',
      children: [
        createElement('button', { className: 'premium-btn', text: 'Book Now', attrs: { type: 'button' } }),
        createElement('a', { className: 'ghost-btn', text: 'Directions', attrs: { href: getDirectionsUrl(turf), target: '_blank', rel: 'noopener' } })
      ]
    });
    actions.querySelector('button').addEventListener('click', () => openBooking(turf.id));

    refs.detailContent.replaceChildren(header, details, reviews, actions);
  }

  function renderReviews(turf, sortMode) {
    const list = [...turf.reviewsList];
    if (sortMode === 'highest') list.sort((a, b) => b.rating - a.rating);
    if (sortMode === 'lowest') list.sort((a, b) => a.rating - b.rating);

    const grid = createElement('div', { className: 'review-grid' });
    list.forEach((review) => {
      const photos = createElement('div', { className: 'review-photos' });
      photos.append(...(review.photos || []).map((src) => createElement('img', {
        attrs: { src, alt: `Review photo from ${review.name}`, loading: 'lazy' }
      })));
      grid.append(createElement('article', {
        className: 'review-card',
        children: [
          createElement('strong', { text: `${review.name} · ${review.rating}/5` }),
          createElement('span', { className: 'muted-small', text: `${review.date}${review.verified ? ' · Verified review' : ''}` }),
          createElement('p', { text: review.text }),
          photos
        ]
      }));
    });
    return grid;
  }

  function openShare(id) {
    const turf = getTurfById(id);
    if (!turf) return;
    state.shareTurfId = id;
    const url = getShareUrl(turf);
    const text = `Book ${turf.name} on Khela Kya: ${url}`;

    refs.shareTitle.textContent = turf.name;
    refs.shareSubtitle.textContent = `${turf.addr} · ${INR.format(turf.price)}/hr`;
    refs.shareWhatsApp.href = `https://wa.me/?text=${encodeURIComponent(text)}`;
    refs.shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    refs.shareInstagram.href = 'https://www.instagram.com/';
    refs.shareFeedback.textContent = 'Instagram sharing opens Instagram; use Copy Link for the turf URL.';
    refs.shareModal.hidden = false;
  }

  function closeShare() {
    refs.shareModal.hidden = true;
  }

  async function copyShareLink() {
    const turf = getTurfById(state.shareTurfId);
    if (!turf) return;
    const url = getShareUrl(turf);
    try {
      await navigator.clipboard.writeText(url);
      refs.shareFeedback.textContent = 'Link copied.';
    } catch (err) {
      refs.shareFeedback.textContent = url;
    }
  }

  function getShareUrl(turf) {
    const url = new URL(window.location.href);
    url.searchParams.set('turf', turf.id);
    return url.toString();
  }

  function getTurfById(id) {
    return state.allTurfs.find((turf) => String(turf.id) === String(id));
  }

  function getDirectionsUrl(turf) {
    const url = new URL('https://www.google.com/maps/dir/');
    url.searchParams.set('api', '1');
    if (state.userLocation) {
      url.searchParams.set('origin', `${state.userLocation.lat},${state.userLocation.lng}`);
    }
    url.searchParams.set('destination', `${turf.lat},${turf.lng}`);
    url.searchParams.set('travelmode', 'driving');
    return url.toString();
  }

  function distanceBetween(lat1, lon1, lat2, lon2) {
    const radius = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
    return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function toRadians(value) {
    return value * Math.PI / 180;
  }

  function estimateTravelMinutes(distanceKm) {
    return Math.max(4, Math.round((distanceKm / 18) * 60 + 3));
  }

  function formatDistance(turf) {
    return turf.distanceKm === null || turf.distanceKm === undefined ? 'Set location' : `${turf.distanceKm.toFixed(1)} km away`;
  }

  function formatTravelTime(turf) {
    return turf.travelMinutes ? `${turf.travelMinutes} min drive` : 'ETA after location';
  }

  function isOpenNow(turf) {
    const now = new Date();
    const start = getDateForTime(turf.open, now);
    const end = getDateForTime(turf.close, now);
    return now >= start && now <= end;
  }

  function getLiveStatus(turf) {
    const now = new Date();
    const end = getDateForTime(turf.close, now);
    const hasSlot = turf.slots.some((slot) => slot.available);

    if (!hasSlot) {
      return { kind: 'warn', label: 'Fully booked today' };
    }
    if (isOpenNow(turf)) {
      const hoursLeft = Math.max(0, Math.round((end - now) / 36e5));
      if (hoursLeft <= 2) return { kind: 'warn', label: `Closing in ${hoursLeft || 1} hour` };
      return { kind: 'ok', label: 'Open now' };
    }
    return { kind: 'warn', label: `Next available ${getNextAvailableSlot(turf)}` };
  }

  function getDateForTime(time, date) {
    const [hours, minutes] = time.split(':').map(Number);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
  }

  function getNextAvailableSlot(turf) {
    const slot = turf.slots.find((item) => item.available);
    return slot ? slot.time : 'Tomorrow 8 AM';
  }

  function getFirstAvailableSlot(turf) {
    const slot = turf.slots.find((item) => item.available);
    return slot ? slot.time : null;
  }

  function setDateDefaults() {
    const today = getTodayIso();
    refs.bookingDate.min = today;
    refs.bookingDate.value = today;
  }

  function getTodayIso() {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 10);
  }

  function formatDate(value) {
    if (!value) return 'Today';
    return new Date(`${value}T12:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function to12Hour(time) {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  }

  function handleEscape(event) {
    if (event.key !== 'Escape') return;
    if (!refs.bookingModal.hidden) closeBooking();
    if (!refs.detailModal.hidden) closeDetails();
    if (!refs.shareModal.hidden) closeShare();
  }

  function debounce(fn, wait) {
    let timeoutId;
    return function debounced() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(fn, wait);
    };
  }
})();
