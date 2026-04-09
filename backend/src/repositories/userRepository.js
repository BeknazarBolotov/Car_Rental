const User = require('../models/User');

const userRepository = {
  findAll: () => User.find().select('-password'),
  findById: (id) => User.findById(id).select('-password'),
  findByEmail: (email) => User.findOne({ email }),
  create: (data) => User.create(data),
  updateById: (id, data) => User.findByIdAndUpdate(id, data, { new: true }).select('-password'),
  deleteById: (id) => User.findByIdAndDelete(id),
};

module.exports = userRepository;