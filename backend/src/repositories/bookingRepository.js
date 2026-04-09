const Booking = require('../models/Booking');

const bookingRepository = {
  findAll: () => Booking.find().populate('user', 'name email').populate('car', 'brand model image pricePerDay'),
  findByUser: (userId) => Booking.find({ user: userId }).populate('car', 'brand model image pricePerDay'),
  findById: (id) => Booking.findById(id).populate('user', 'name email').populate('car'),
  create: (data) => Booking.create(data),
  updateById: (id, data) => Booking.findByIdAndUpdate(id, data, { new: true }),
  deleteById: (id) => Booking.findByIdAndDelete(id),
  checkOverlap: (carId, startDate, endDate, excludeId = null) => {
    const query = {
      car: carId,
      status: { $in: ['pending', 'approved'] },
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
      ]
    };
    if (excludeId) query._id = { $ne: excludeId };
    return Booking.findOne(query);
  }
};

module.exports = bookingRepository;