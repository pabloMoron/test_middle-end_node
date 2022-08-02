"use strict"
import * as express from "express"
import {initSearchRoute} from "../routes/searchRoute";
import {initItemsRouter} from "../routes/itemRoute"
import {prevMiddleware, postMiddleware, requestLogger} from './middlewares'
import  {logRequest}  from "../Logger/logger";
export const init = (app: express.Express):void  => {
    //Aqui se puede iniciar otros routers
    initItemsRouter(app)
    initSearchRoute(app)

    app.use("/api/hello",helloRouter)
    
}

let helloRouter = express.Router()
helloRouter.get("/", prevMiddleware, (req, res, next) => {
        res.json({
            message: "Hello! ^^"
        })
        next()
    }, postMiddleware)