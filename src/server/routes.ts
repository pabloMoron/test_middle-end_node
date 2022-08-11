"use strict"
import * as express from "express"
import {initSearchRoute} from "../routes/searchRoute"
import {initItemsRouter} from "../routes/itemRoute"
import passport = require("passport")

export const init = (app: express.Express):void  => {
    //Aqui se puede iniciar otros routers
    initSearchRoute(app)
    initItemsRouter(app)

    app.use(helloRouter)
}

function hello (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.json({
        message: "Hello! ^^"
    })
}

let helloRouter = express.Router()
helloRouter.post("/api/hello/:pathParam", passport.authenticate('token', {session: false}), hello)