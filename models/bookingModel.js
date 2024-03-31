const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  roomId: { type: String, required: true },
  numberOfDays: { type: Number, required: true },
  image: { type: Object, required: true },
  location: {
    address: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zipcode: { type: Number, required: true, trim: true }
  },
  host: {
    name: { type: String, required: true }
  },
  title: { type: String, required: true },
  stayDate: {
    startStay: { type: Date, required: true },
    endStay: { type: Date, required: true }
  },
  guests: { type: Number, required: true },
  pricing: {
    totalPrice: { type: Number, required: true },
    basePrice: { type: Number, required: true },
    cleaningFee: { type: Number, required: true },
    serviceFee: { type: Number, required: true }
  }
});

const Booking = mongoose.model('Booking', bookingSchema,'bookings');

module.exports = Booking;