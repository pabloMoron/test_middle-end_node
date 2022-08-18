"use strict"
import { Express, Router } from "express"
import passport = require("passport")
import { searchItems } from "../search"

export const initSearchRoute = (app: Express): void => {
    const searchRoute = Router()

    ///Swagger
    /**
     * @swagger
     * /api/sites/{site}/search:
     *  get:
     *   tags:
     *    - search
     *   security:
     *    - token: [e962f81a-4d42-4eb3-86cd-a25e7237c8dc, e962f81a-4d42-4eb3-86cd-a25e7237c8dc2]
     * 
     *   summary: search items
     *   parameters:
     * 
     *    - in: path
     *      name: site
     *      description: available path, only "MLA", "MLB" or "MLC"
     *      schema:
     *          type: string
     *          required: true
     *    
     *    - in: query
     *      name: q
     *      description: published items you want to search
     *      schema:
     *          type: string
     *          required: true
     *     
     *    - in: query
     *      name: limit
     *      description: published items you want to search
     *      schema:
     *          type: string
     *          required: false
     *    
     *    - in: query
     *      name: offset
     *      description: published items you want to search
     *      schema:
     *          type: string
     *          required: false
     *    
     *    - in: query 
     *      name: sort
     *      description: sort method, allowed "price_asc" or "price_desc"
     *      schema:
     *          type: string
     *          required: false
     * 
     *   responses:
     *    200:
     *     description: the results of the search
     *     content:
     *      application/json:
     *       schema:
     *        $ref: '#/components/schemas/SearchResult'
     * 
     *    400:
     *     description: Bad request, no 'x-auth-token' header found or validation error
     *     content:
     *      application/json:
     *       schema:
     *        oneOf:
     *         - $ref: '#/components/schemas/NotFound'
     *         - $ref: '#/components/schemas/ValidationError'
     * 
     *    401:
     *     description: Unauthorized
     * 
     *    500:
     *     description: Internal server error
     *     content:
     *      application/json:
     *       schema:
     *        $ref: '#/components/schemas/GenericError'
     * 
     * components:
     *  securitySchemes:
     *   token:
     *    type: apiKey
     *    name: x-auth-token
     *    in: header
     *  
     *  schemas:
     *   ValidationError:
     *    type: object
     *    properties:
     *     error:
     *      type: object
     *      properties:
     *       messages:
     *        type: array
     *        items:
     *         type: object
     *         properties:
     *          path:
     *           type: string
     *          message:
     *           type: string
     * 
     *   SearchResult: 
     *     type: object
     *     properties: 
     *       paging: 
     *         type: object
     *         properties: 
     *           total: 
     *             type: integer
     *             format: int32
     *           offset: 
     *             type: integer
     *             format: int32
     *           limit: 
     *             type: integer
     *             format: int32
     *       categories: 
     *         type: array
     *         items: 
     *           type: string
     *       items: 
     *         type: array
     *         items: 
     *           type: object
     *           properties: 
     *             id: 
     *               type: string
     *             title: 
     *               type: string
     *             price: 
     *               type: object
     *               properties: 
     *                 currency: 
     *                   type: string
     *                 amount: 
     *                   type: integer
     *                   format: int32
     *                 decimals: 
     *                   type: integer
     *                   format: int32
     *             picture: 
     *               type: string
     *             condition: 
     *               type: string
     *             free_shipping: 
     *               type: boolean
     * 
     *   NotFound:
     *    type: object
     *    properties:
     *     url:
     *      type: string
     *     error:
     *      type: string
     *      value: Not Found
     * 
     *   GenericError:
     *    type: object
     *    properties:
     *     error:
     *      type: string
     */
    searchRoute
        .get("/api/sites/:site/search", passport.authenticate('token', { session: false }), searchItems)
    app.use(searchRoute)
}