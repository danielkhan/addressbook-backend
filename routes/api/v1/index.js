const express = require('express');
const contactRoute = require('./contacts');
const userRoute = require('./users');
const passport = require('passport');

const router = express.Router();

module.exports = (params) => {
  router.use('/contacts', passport.authenticate('jwt', { session: false }), contactRoute(params));
  router.use('/users', userRoute(params));
  return router;
};
