const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  category: { type: String, enum: ['sedan', 'suv', 'sports', 'luxury', 'electric', 'minivan'], required: true },
  pricePerDay: { type: Number, required: true },
  transmission: { type: String, enum: ['automatic', 'manual'], default: 'automatic' },
  fuel: { type: String, enum: ['petrol', 'diesel', 'electric', 'hybrid'], default: 'petrol' },
  seats: { type: Number, default: 5 },
  mileage: { type: Number, default: 0 },
  color: { type: String, default: 'Black' },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  features: [String],
  isAvailable: { type: Boolean, default: true },
  location: { type: String, default: 'Bishkek' },
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Auto-calculate average rating
carSchema.methods.updateRating = function () {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.totalReviews = 0;
  } else {
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10;
    this.totalReviews = this.reviews.length;
  }
};

module.exports = mongoose.model('Car', carSchema);