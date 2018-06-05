const bunyan = require('bunyan');

module.exports = {
  development: {
    logger: () =>
      bunyan.createLogger({
        name: 'adressbook-backend-development',
        level: 'debug',
      }),
    swagger: {
      info: {
        title: 'Adressbook Development',
        version: '1.0.0',
        description: 'Adressbook API',
      },
      host: 'localhost:3001',
      basePath: '/api/v1',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
  },
  production: {
    logger: () =>
      bunyan.createLogger({
        name: 'adressbook-backend-production',
        level: 'info',
      }),
  },
  test: {
    logger: () =>
      bunyan.createLogger({
        name: 'adressbook-backend-test',
        level: 'error',
      }),
  },
};
