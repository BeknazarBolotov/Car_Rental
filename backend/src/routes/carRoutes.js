const express = require('express');
const router = express.Router();
const { getCars, getCarById, createCar, updateCar, deleteCar, addReview } = require('../controllers/carController');
const { protect } = require('../middleware/auth');
const { roles } = require('../middleware/roles');

router.get('/', getCars);
router.get('/:id', getCarById);
router.post('/', protect, roles('admin', 'manager'), createCar);
router.put('/:id', protect, roles('admin', 'manager'), updateCar);
router.delete('/:id', protect, roles('admin'), deleteCar);
router.post('/:id/reviews', protect, roles('user'), addReview);

module.exports = router;