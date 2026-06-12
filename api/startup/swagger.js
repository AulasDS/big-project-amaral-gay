const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Pedidos',
      version: '1.0.0',
      description: 'Documentação automática da API',
    },
  },
  apis: ['./startup/router.js', './src/routes/*.js'], // Caminho onde estão as rotas com comentários
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

function startSwagger(app){
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

module.exports = startSwagger;
