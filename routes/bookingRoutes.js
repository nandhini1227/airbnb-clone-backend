const express = require('express');
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/authMiddleWare');

const Router = express.Router();

Router.post('/room/booking',
  auth.protect,
  bookingController.createBooking
);

Router.get('/mybookings/:id',
  auth.protect,
  bookingController.getAllBooking
);

module.exports = Router;
