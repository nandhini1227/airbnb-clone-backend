const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const accessToken = id => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: '15m'
  });
};

exports.refresh = (req, res) => {
  const { cookies } = req;
  if (!cookies.jwt) {
    return res.status(401).json({
      status: 'error',
      message: 'UnAuthorized'
    });
  }
  const refreshTokenCookie = cookies.jwt;
  jwt.verify(
    refreshTokenCookie,
    process.env.JWT_REFRESH_TOKEN,
    async (err, decoded) => {
      if (err) return res.status(401).json({ status: 401 });
      const foundUser = await User.findById(decoded.id).select('-password');
      if (!foundUser)
        return res.status(401).json({ message: 'Unauthorized User' });
      res.json({
        status: 'success',
        message: 'new token generated',
        data: {
          userId: foundUser._id,
          name: foundUser.name,
          token: accessToken(foundUser._id)
        }
      });
    }
  );
};

exports.logout = async (req, res) => {
  const { cookies } = req;
  if (!cookies.jwt) return res.sendStatus(204);
  await res.clearCookie('jwt');
  res.json({ status: 'info', message: 'logged Out' });
};