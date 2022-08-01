"use strict"

import * as express from "express"
import * as item from "../items"

const itemsRouter: express.IRouter = express.Router()

export function initItemsRouter(app: express.Express): void {
    itemsRouter.get("/:id", findItemById)
    app.use("/api/items", itemsRouter)
}

const findItemById = (req: express.Request, res: express.Response) => {
    var id = req.params.id;
    console.log(id)
    //TODO services
    res.json("ok")
}