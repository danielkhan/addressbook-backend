const express = require('express');
const contactRoute = require('./contacts');

const router = express.Router();

module.exports = (params) => {
  router.use('/contacts', contactRoute(params));
  return router;
};
