"use strict"

import * as express from "express"
import passport = require("passport")
import { findItemDescription } from "../items/services"

const itemsRouter: express.IRouter = express.Router()

export function initItemsRouter(app: express.Express): void {
    itemsRouter
    .route("/api/:site/items/:id")
    .get(passport.authenticate('token', {session: false}), findItemDescription)
    app.use(itemsRouter)
}