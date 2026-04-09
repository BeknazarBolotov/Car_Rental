const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const authService = {
  register: async ({ name, email, password, phone }) => {
    const exists = await userRepository.findByEmail(email);
    if (exists) throw new Error('Email already registered');
    const user = await userRepository.create({ name, email, password, phone });
    const token = generateToken(user._id);
    return { token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } };
  },

  login: async ({ email, password }) => {
    const user = await userRepository.findByEmail(email);
    if (!user || !(await user.matchPassword(password))) throw new Error('Invalid credentials');
    if (!user.isActive) throw new Error('Account deactivated');
    const token = generateToken(user._id);
    return { token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } };
  },

  getMe: async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');
    return user;
  }
};

module.exports = authService;