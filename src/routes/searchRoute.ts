"use strict"
import { Express, Router, Request, Response, NextFunction } from "express"

export const initSearchRoute = (app: Express): void => {
    const searchRoute = Router()
    
    searchRoute
    .get("/", (req: Request, res: Response, next: NextFunction) => {
        let q = req.query.q
        console.log(q)
        //TODO services
        res.json("ok")
        next()
    })
    app.use("/api/search", searchRoute)
}