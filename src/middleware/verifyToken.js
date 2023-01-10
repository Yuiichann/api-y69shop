const jwt = require('jsonwebtoken');
const config = require('../config/config');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: 'error', msg: 'Invalid token!' });
  }

  jwt.verify(token, config.jwt.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return err.message === 'jwt expired'
        ? res.status(403).json({ status: 'error', msg: 'Token has expired!' })
        : res.status(401).json({ status: 'error', msg: 'Invalid token!' });
    }

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      username: decoded.username,
    };

    next();
  });
};

module.exports = verifyToken;
