import * as express from "express"
import * as routes from "./routes"
import { IConfig } from "./environment"
import * as cors from "cors"
import { errorHandler, handle404 } from "./error"
import passport = require("passport")
import * as token from "../middlewares/passport"
import { errorLogger, requestLogger } from "../middlewares/logger"
import path = require("path")

export function initialize(config: IConfig): express.Express {
    const app = express()
    app.disable("x-powered-by")
    app.use(cors())

    app.use(express.urlencoded({
        extended: true,
        limit: "5mb"
      }));

    app.use(express.json({
      limit: "5mb"
    }))

    app.use(passport.initialize());
    token.init()
   
    app.use(requestLogger)
    routes.init(app)
    app.use(
      express.static(path.join(__dirname, "../../public"), { maxAge: 31557600000 })
    );
    app.use(errorLogger)
    app.use(errorHandler)
    app.use(handle404)
    return app
}