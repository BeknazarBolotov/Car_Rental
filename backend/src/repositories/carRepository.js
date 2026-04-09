const Car = require('../models/Car');

const carRepository = {
  findAll: (filter = {}) => Car.find(filter).populate('addedBy', 'name'),
  findById: (id) => Car.findById(id).populate('addedBy', 'name').populate('reviews.user', 'name'),
  create: (data) => Car.create(data),
  updateById: (id, data) => Car.findByIdAndUpdate(id, data, { new: true }),
  deleteById: (id) => Car.findByIdAndDelete(id),
  search: (query) => Car.find({
    $or: [
      { brand: { $regex: query, $options: 'i' } },
      { model: { $regex: query, $options: 'i' } },
      { category: { $regex: query, $options: 'i' } },
    ]
  }),
};

module.exports = carRepository;