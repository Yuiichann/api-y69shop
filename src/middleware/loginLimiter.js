const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit.rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    status: 'warning',
    msg: 'Too many login attempts from this IP, please try again after a 60 second pausey',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = loginLimiter;
