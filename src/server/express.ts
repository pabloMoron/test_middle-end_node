import * as express from "express"
import * as routes from "./routes"
import { IConfig } from "./environment"

export function initialize(config: IConfig): express.Express {
    const app = express.default()
    routes.init(app)

    return app
}