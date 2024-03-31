const Booking = require('../models/bookingModel');

exports.createBooking = async (req, res) => {
  try {
    const newRoom = await Booking.create(req.body);

    res.status(200).json({
      status: 'success',
      message: 'Booked Successfully',
      data: {
        room: newRoom
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'Failed, Please try again',
      data: err
    });
  }
};

exports.getAllBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const query = await Booking.find({ userId: id });
    res.status(200).json({
      status: 'success',
      result: query.length,
      data: query
    });
  } catch (err) {
    res.status(404).json({
      status: 'Not found',
      message: err
    });
  }
};