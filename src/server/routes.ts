"use strict"
import * as express from "express"
import {initSearchRoute} from "../routes/searchRoute";
import {initItemsRouter} from "../routes/itemRoute"

export const init = (app: express.Express):void  => {
    //Aqui se puede iniciar otros routers
    //initItemsRouter(app)
    //initSearchRoute(app)

    app.use("/api/hello",helloRouter)
    
}

const prevMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    console.log("previous")
    next()
}
const postMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    console.log("post")
    next()
}

let helloRouter = express.Router()
helloRouter.get("/", prevMiddleware, (req, res, next) => {
        res.json({
            message: "Hello! ^^"
        })
        next()
    }, postMiddleware)