const carService = require('../services/carService');

const getCars = async (req, res) => {
  try {
    const cars = await carService.getAllCars(req.query);
    res.json(cars);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getCarById = async (req, res) => {
  try {
    const car = await carService.getCarById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const createCar = async (req, res) => {
  try {
    const car = await carService.createCar(req.body, req.user._id);
    res.status(201).json(car);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

const updateCar = async (req, res) => {
  try {
    const car = await carService.updateCar(req.params.id, req.body);
    res.json(car);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

const deleteCar = async (req, res) => {
  try {
    await carService.deleteCar(req.params.id);
    res.json({ message: 'Car deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const addReview = async (req, res) => {
  try {
    const car = await carService.addReview(req.params.id, req.user._id, req.user.name, req.body);
    res.status(201).json(car);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

module.exports = { getCars, getCarById, createCar, updateCar, deleteCar, addReview };