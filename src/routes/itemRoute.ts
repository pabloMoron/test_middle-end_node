"use strict"

import * as express from "express"
import { findItemDescriptionById } from "../items/services"
import * as items from "../items"

const itemsRouter: express.IRouter = express.Router()

export function initItemsRouter(app: express.Express): void {
    itemsRouter
    .route("/api/items/:id")
    .get(findItemDescriptionById)
    app.use(itemsRouter)
}