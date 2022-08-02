import * as express from "express"
import * as winston from "winston"
import * as wm from "winston-mongodb"
import { getConfig } from "../server/environment"

const config = getConfig("develop")
export const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(winston.format.timestamp(), winston.format.json())
        }),
        new winston.transports.File({
            dirname: "e:/logs/",
            filename: "debug.log",
            level: "debug",
        }),
        new wm.MongoDB({
            
            db: config.mongoDB,
            level: "error",
            collection: "err",
            options:{
               useUnifiedTopology: true
            }
        })
    ]
})
export const logRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(req.headers)
    logger.debug("hi")
    next()
}