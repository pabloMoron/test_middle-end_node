"use strict"
import { Express, Router } from "express"
import passport = require("passport")
import { searchItems } from "../search"

export const initSearchRoute = (app: Express): void => {
    const searchRoute = Router()

    searchRoute
        .get("/api/sites/:site/search", passport.authenticate('token', { session: false }), searchItems)
    app.use(searchRoute)
}