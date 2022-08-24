import { Express } from "express";
import * as swaggerUI from "swagger-ui-express"
import * as swaggerJsDoc from "swagger-jsdoc"
import path = require("path");


const openApiSpec: swaggerJsDoc.OAS3Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Test middle end Pablo Moron',
            version: '1.0.0',
        },
        servers: [{
            url: "http://localhost:9000"
        }],
    },
    apis: [path.join(__dirname, "../routes/*.js")],
}


export function initSwagger(app: Express) {
    app.use("/api/swagger", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(openApiSpec)))
}