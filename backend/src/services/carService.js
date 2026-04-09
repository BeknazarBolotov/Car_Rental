const carRepository = require('../repositories/carRepository');

const carService = {
  getAllCars: async (filters) => {
    const query = {};
    if (filters.category) query.category = filters.category;
    if (filters.minPrice || filters.maxPrice) {
      query.pricePerDay = {};
      if (filters.minPrice) query.pricePerDay.$gte = Number(filters.minPrice);
      if (filters.maxPrice) query.pricePerDay.$lte = Number(filters.maxPrice);
    }
    if (filters.available === 'true') query.isAvailable = true;
    if (filters.transmission) query.transmission = filters.transmission;
    if (filters.search) {
      return carRepository.search(filters.search);
    }
    return carRepository.findAll(query);
  },

  getCarById: (id) => carRepository.findById(id),

  createCar: async (data, userId) => {
    data.addedBy = userId;
    return carRepository.create(data);
  },

  updateCar: (id, data) => carRepository.updateById(id, data),

  deleteCar: (id) => carRepository.deleteById(id),

  addReview: async (carId, userId, userName, { rating, comment }) => {
    const car = await carRepository.findById(carId);
    if (!car) throw new Error('Car not found');
    const alreadyReviewed = car.reviews.find(r => r.user.toString() === userId.toString());
    if (alreadyReviewed) throw new Error('Already reviewed this car');
    car.reviews.push({ user: userId, userName, rating, comment });
    car.updateRating();
    await car.save();
    return car;
  }
};

module.exports = carService;