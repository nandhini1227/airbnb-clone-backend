const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  //title:{type:String,required:true,trim:true},
  description: { type: String, required: true, trim: true },
  title: { type: String, required: true },
  location: {
    address: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zipcode: { type: Number, required: true, trim: true }
  },
  userId: { type: String, required: true },
  host: {
    name: { type: String, required: true, trim: true },
    profile: { type: {}, required: true, trim: true },
    about: { type: String, required: true, trim: true }
  },
  guestCapacity: { type: Number, required: true, trim: true },
  bedroom: { type: Number, required: true, trim: true },
  bed: { type: Number, required: true, trim: true },
  bathroom: { type: Number, required: true, trim: true },
  pricing: {
    basePrice: { type: Number, default: null, trim: true },
    cleaningFee: { type: Number, default: null, trim: true },
    serviceFee: { type: Number, default: null, trim: true }
  },
  stayDate: {
    startDate: { type: Date, default: null, trim: true },
    endDate: { type: Date, default: null, trim: true }
  },
  // Individual room summary
  aboutThisSpace: { type: String, required: true, trim: true },
  amenities: [String],
  // Rating
  rating: { type: Number, default: 0, trim: true },
  images: [{}],
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
});

const Room = mongoose.model('Room', roomSchema,'rooms');

module.exports = Room;