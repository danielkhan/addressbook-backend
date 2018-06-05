const createError = require('http-errors');
const express = require('express');
const swagger = require('./utils/swagger');
const routes = require('./routes');

const ContactService = require('./services/ContactService');

module.exports = (config) => {
  const app = express();

  const logger = config.logger();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  const contactService = new ContactService();

  app.use('/', routes({
    config,
    contactService,
  }));

  app.use('/swagger', swagger({
    config,
  }));

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    next(createError(404));
  });

  app.use((err, req, res, next) => {
    const shownError = req.app.get('env') === 'development' ? err : {};
    logger.debug(shownError);
    res.status(err.status || 500);
    return res.json({
      error: err.message,
    });
  });

  return app;
};
