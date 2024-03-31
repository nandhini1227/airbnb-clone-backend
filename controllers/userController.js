const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const accessToken = id => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: '20s'
  });
};

const refreshToken = id => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: '7d'
  });
};

const cookieConfig = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const query = await User.findOne({ email });
    if (query) {
      if (await bcrypt.compare(password, query.password)) {
        await res.cookie('jwt', refreshToken(query._id), cookieConfig);
        res.status(200).json({
          status: 'success',
          message: 'Successfully loggedIn',
          data: {
            userId: query._id,
            name: query.name,
            token: accessToken(query._id)
          }
        });
      } else {
        res.status(401).json({
          status: 'error',
          message: 'Invalid password'
        });
      }
    } else {
      res.status(401).json({
        status: 'error',
        message: 'unauthorized: Invalid credentials'
      });
    }
  } catch (err) {
    res.status(401).json({
      status: 'error',
      message: err
    });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });
    res.cookie('jwt', refreshToken(user._id), cookieConfig);
    res.status(201).json({
      status: 'success',
      message: 'Successfully Created',
      data: {
        name: user.name,
        email: user.email,
        token: accessToken(user._id)
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'User already exists',
      data: err
    });
  }
};