// swagger.config.js

import SwaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        info: {
            title: 'BookSentimentLeague API',
            version: '1.0.0',
            description: 'BookSentimentLeaue API test'
        },
        host: '3.37.54.220:3000',
        basepath: '../'
    },
    apis: ['./src/routes/*.js', './swagger/*']
};


export const specs = SwaggerJsdoc(options);