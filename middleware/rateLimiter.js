const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60000, //1 minute
  max: 100, //you can have 100 requests (by IP)
  message: 'You are being rate limited!', 
  headers: true,
});
module.exports = limiter;