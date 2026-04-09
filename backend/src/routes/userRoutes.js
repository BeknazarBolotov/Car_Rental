const express = require('express');
const router = express.Router();
const { getAllUsers, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { roles } = require('../middleware/roles');

router.get('/', protect, roles('admin'), getAllUsers);
router.put('/:id', protect, roles('admin'), updateUser);
router.delete('/:id', protect, roles('admin'), deleteUser);

module.exports = router;