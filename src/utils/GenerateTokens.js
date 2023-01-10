const jwt = require('jsonwebtoken');
const config = require('../config/config');

const GenerateTokens = (payload) => {
  const accessToken = jwt.sign(payload, config.jwt.ACCESS_TOKEN_SECRET, {
    expiresIn: '1d', // 1d to test, production: 1m
  });

  const refreshToken = jwt.sign(payload, config.jwt.REFRESH_TOKEN_SECRET, {
    expiresIn: '4d',
  });

  return { accessToken, refreshToken };
};

module.exports = GenerateTokens;
