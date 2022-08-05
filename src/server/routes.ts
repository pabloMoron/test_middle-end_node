"use strict"
import * as express from "express"
import {initSearchRoute} from "../routes/searchRoute";
import {initItemsRouter} from "../routes/itemRoute"
import passport = require("passport");

export const init = (app: express.Express):void  => {
    //Aqui se puede iniciar otros routers
    initSearchRoute(app)
    initItemsRouter(app)

    app.use(helloRouter)
}

const hello = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // throw new Error("💥");
    
    console.log(req.user)
    res.json({
        message: "Hello! ^^"
    })
}
interface Ireq extends express.Request{
    b: string,
    mock: boolean
}

let helloRouter = express.Router()
helloRouter.post("/api/hello/:pathParam", passport.authenticate('token', {session: false}), hello)