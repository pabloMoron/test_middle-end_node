"use strict"

import { Express, Router, Response } from "express"
import passport = require("passport")
import { findItemDescriptionById } from "../services/items"
import { IISessionRequest } from "../middlewares/passport"
import { handle } from "../server/error"

export function initItemsRouter(app: Express): void {
  const itemsRouter = Router()

  ///Swagger
  /**
   * @swagger
   * /api/items/{id}:
   *  get:
   *   tags:
   *    - items
   *   security:
   *    - token: []
   *
   *   summary: search items
   *   parameters:
   *
   *    - in: path
   *      name: id
   *      description: an item id
   *      schema:
   *          type: string
   *          required: true
   *
   *   responses:
   *    200:
   *     description: the results of the search
   *     content:
   *      application/json:
   *       schema:
   *        $ref: '#/components/schemas/ItemResult'
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
   *   ItemResult:
   *     type: object
   *     properties:
   *       author:
   *         type: object
   *         properties:
   *           lastname:
   *             type: string
   *           name:
   *             type: string
   *       item:
   *         type: object
   *         properties:
   *           id:
   *             type: string
   *           title:
   *             type: string
   *           description:
   *             type: string
   *           condition:
   *             type: string
   *           picture:
   *             type: string
   *           free_shipping:
   *             type: boolean
   *           price:
   *             type: object
   *             properties:
   *               amount:
   *                 type: number
   *               currency:
   *                 type: string
   *               decimals:
   *                 type: number
   *           sold_quantity:
   *             type: number
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
  itemsRouter
    .route("/api/items/:id")
    .get(
      passport.authenticate("token", { session: false }),
      findItemDescription
    )
  app.use(itemsRouter)
}

export async function findItemDescription(
  req: IISessionRequest,
  res: Response
) {
  try {
    const itemDesc = await findItemDescriptionById(req.user, req.params.id)
    res.json(itemDesc)
  } catch (exception) {
    handle(res, exception)
  }
}
