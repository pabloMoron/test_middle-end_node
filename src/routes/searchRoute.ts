"use strict"
import { Express, Router, Request, Response, NextFunction } from "express"

export const initSearchRoute = (app: Express): void => {
    const searchRoute = Router()
    
    searchRoute
    .get("/api/sites/:site/search", (req: Request, res: Response) => {
        //TODO services
        res.json("ok")
    })
    app.use(searchRoute)
}