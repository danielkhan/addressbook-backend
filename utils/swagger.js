const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const pathToSwaggerUi = require('swagger-ui-dist').absolutePath();

const router = express.Router();

module.exports = (params) => {
  if (!params.config.swagger) return router;

  const options = {
    swaggerDefinition: params.config.swagger,
    apis: ['routes/**/*.js'],
  };

  const swaggerSpec = swaggerJSDoc(options);

  router.get('/json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return res.send(swaggerSpec);
  });

  router.use('/ui', express.static(pathToSwaggerUi));

  return router;
};
