
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'ContentFlow API',
      version: '1.0.0',
      description: 'Documentação da API do ContentFlow',
    },

    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Servidor local',
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },

  apis: [
    './src/Router/*.ts',
    './dist/Router/*.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
