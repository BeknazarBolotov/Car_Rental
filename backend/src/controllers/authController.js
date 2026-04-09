const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.user._id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

module.exports = { register, login, getMe };