const express = require('express');
const authController = require('../controllers/authController');

const Router = express.Router();

Router.get('/auth/refresh', authController.refresh);
Router.get('/auth/logout', authController.logout);

module.exports = Router;
