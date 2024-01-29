// swagger.config.js

import SwaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        info: {
            title: 'Book Sentiment League',
            version: '1.0.0',
            description: 'Book Sentiment League with express, API 설명'
        },
        host: 'localhost:3000',
        basepath: '../'
    },
    apis: ['./src/routes/*.js', './swagger/*']
};

export const specs = SwaggerJsdoc(options);