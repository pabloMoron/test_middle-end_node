"use strict"

import * as express from "express"
import passport = require("passport")
import { findItemDescriptionById } from "../services/items"
import { IISessionRequest } from "../middlewares/passport"
import { handle } from "../server/error"

const itemsRouter: express.IRouter = express.Router()

export function initItemsRouter(app: express.Express): void {
    itemsRouter
        .route("/api/items/:id")
        .get(passport.authenticate('token', { session: false }), findItemDescription)
    app.use(itemsRouter)
}

export async function findItemDescription(req: IISessionRequest, res: express.Response) {
    try {
        const itemDesc = await findItemDescriptionById(req.user, req.params.id)
        res.json(itemDesc)
    }
    catch (exception) {
        handle(res, exception)
    }
}
