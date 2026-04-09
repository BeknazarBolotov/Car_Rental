const bookingService = require('../services/bookingService');

const getBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings(req.user._id, req.user.role);
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });
    res.json(booking);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const createBooking = async (req, res) => {
  try {
    const booking = await bookingService.createBooking(req.body, req.user._id);
    res.status(201).json(booking);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await bookingService.updateStatus(req.params.id, status, req.user._id);
    res.json(booking);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.id, req.user._id, req.user.role);
    res.json(booking);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

module.exports = { getBookings, getBookingById, createBooking, updateBookingStatus, cancelBooking };