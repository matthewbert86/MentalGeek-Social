const jwt = require('jsonwebtoken');
const config = require('config');

// A middleware function has access to the req and res objects
// next is a callback that we run so we can move on to the next piece of middleware

module.exports = function(req, res, next) {
  // Get token from header for when we send request from protected route
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token. Authorization denied' });
  }

  // verify the token
  try {
    // decode token
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    // take req object and asign value to user
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
