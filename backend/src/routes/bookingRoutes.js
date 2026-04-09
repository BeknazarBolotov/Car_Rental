const express = require('express');
const router = express.Router();
const { getBookings, getBookingById, createBooking, updateBookingStatus, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { roles } = require('../middleware/roles');

router.get('/', protect, getBookings);
router.get('/:id', protect, getBookingById);
router.post('/', protect, roles('user'), createBooking);
router.put('/:id/status', protect, roles('admin', 'manager'), updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;