"use strict"

import * as express from "express"
import * as routes from "./routes"
import { IConfig } from "./environment"
import * as cors from "cors"
import { errorHandler, handle404 } from "./error"
import passport = require("passport")
import * as token from "../middlewares/passport"
import { requestLogger } from "../middlewares/logger"
import path = require("path")
import { initSwagger } from "../middlewares/swagger"

export function initialize(config: IConfig): express.Express {
    const app = express()
    app.disable("x-powered-by")
    //Habilitar Cors
    app.use(cors())

    app.use(express.urlencoded({
        extended: true,
        limit: "5mb"
      }));

    app.use(express.json({
      limit: "5mb"
    }))

    //Uso passport para validar los tokens
    app.use(passport.initialize());
    token.init()
   
    //Middleware que logea las requests y responses en archivos .log
    app.use(requestLogger)

    //Agrego apidoc
    initSwagger(app)

    //Inicializo la rutas
    routes.init(app)
    
    //Agrego un directorio de contenido estatico
    app.use(
      express.static(path.join(__dirname, "../../public"), { maxAge: 31557600000 })
    );
    
    //Manejo de excepciones
    app.use(errorHandler)
    app.use(handle404)
    
    return app
}