const userRepository = require('../repositories/userRepository');

const getAllUsers = async (req, res) => {
  try {
    const users = await userRepository.findAll();
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateUser = async (req, res) => {
  try {
    const user = await userRepository.updateById(req.params.id, req.body);
    res.json(user);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

const deleteUser = async (req, res) => {
  try {
    await userRepository.deleteById(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getAllUsers, updateUser, deleteUser };