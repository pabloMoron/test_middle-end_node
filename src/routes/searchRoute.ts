"use strict"
import { Express, Router, Request, Response, NextFunction } from "express"
import passport = require("passport")

export const initSearchRoute = (app: Express): void => {
    const searchRoute = Router()
    
    searchRoute
    .get("/api/sites/:site/search", passport.authenticate('token', {session: false}), (req: Request, res: Response) => {
        //TODO services
        res.json("ok")
    })
    app.use(searchRoute)
}