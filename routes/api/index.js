const express = require('express');
const v1Route = require('./v1');

const router = express.Router();

module.exports = (params) => {
  router.use('/v1', v1Route(params));
  return router;
};
