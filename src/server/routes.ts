"use strict"

import * as express from "express"
import { initSearchRoute } from "../routes/searchRoute"
import { initItemsRouter } from "../routes/itemRoute"

export const init = (app: express.Express): void => {
  //Aqui se puede iniciar otros routers
  initSearchRoute(app)
  initItemsRouter(app)
}
