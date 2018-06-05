const express = require('express');
const apiRoute = require('./api');

const router = express.Router();

module.exports = (params) => {
  router.use('/api', apiRoute(params));
  return router;
};
