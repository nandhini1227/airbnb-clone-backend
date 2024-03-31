const express = require('express');
const userController = require('../controllers/userController');

const Router = express.Router();

Router.post('/auth/login',userController.loginUser);
Router.post('/auth/register',userController.registerUser);

module.exports = Router;