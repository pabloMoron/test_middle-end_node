import * as express from "express"
import * as routes from "./routes"
import { IConfig } from "./environment"
import { ewLogger } from "../logger/logger"
import * as cors from "cors"
import { errorHandler, handle404 } from "./error"

export function initialize(config: IConfig): express.Express {
    const app = express.default()
    app.disable("x-powered-by")
    app.use(cors.default())
    app.use(express.urlencoded({
        extended: true
      }));
    app.use(express.json())
    app.use(ewLogger)
    routes.init(app)
    app.use(handle404)
    // app.use(errorLogger)
    app.use(errorHandler);
    return app
}