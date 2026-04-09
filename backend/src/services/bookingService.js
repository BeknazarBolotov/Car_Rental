const bookingRepository = require('../repositories/bookingRepository');
const carRepository = require('../repositories/carRepository');

const bookingService = {
  getAllBookings: (userId, role) => {
    if (role === 'user') return bookingRepository.findByUser(userId);
    return bookingRepository.findAll();
  },

  getBookingById: (id) => bookingRepository.findById(id),

  createBooking: async ({ carId, startDate, endDate, notes }, userId) => {
    const car = await carRepository.findById(carId);
    if (!car) throw new Error('Car not found');
    if (!car.isAvailable) throw new Error('Car is not available');

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) throw new Error('End date must be after start date');

    const overlap = await bookingRepository.checkOverlap(carId, start, end);
    if (overlap) throw new Error('Car already booked for these dates');

    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = totalDays * car.pricePerDay;

    return bookingRepository.create({
      user: userId, car: carId, startDate: start, endDate: end,
      totalDays, totalPrice, notes
    });
  },

  updateStatus: async (id, status, managerId) => {
    const update = { status };
    if (status === 'approved') { update.approvedBy = managerId; update.approvedAt = new Date(); }
    return bookingRepository.updateById(id, update);
  },

  cancelBooking: async (id, userId, role) => {
    const booking = await bookingRepository.findById(id);
    if (!booking) throw new Error('Booking not found');
    if (role === 'user' && booking.user._id.toString() !== userId.toString()) {
      throw new Error('Not authorized');
    }
    return bookingRepository.updateById(id, { status: 'cancelled' });
  }
};

module.exports = bookingService;