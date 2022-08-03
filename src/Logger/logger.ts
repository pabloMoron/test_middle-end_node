import * as express from "express"
import * as expressWinston from "express-winston"
import * as winston from "winston"
import * as wm from "winston-mongodb"
import { getConfig } from "../server/environment"

const config = getConfig("develop")

const logger = winston.createLogger({
    format: winston.format.combine(winston.format.timestamp(), winston.format.json(), winston.format.prettyPrint()),
    transports: [
        new winston.transports.Console({
            level: "info",        
        }),
        new winston.transports.File({
            dirname: "e:/logs/",
            filename: `debug${new Date().toISOString().split('T')[0]}.log`,
            level: "debug",
        }),
        new wm.MongoDB({
            db: config.mongoDB,
            level: "info",
            collection: "info",
            options: {
                useUnifiedTopology: true
            },
            metaKey: "metadata"
        })
    ]
})


//WINSTON EXPRESS
export const ewLogger = expressWinston.logger({
    msg: undefined,
    /*
    format: winston.format.combine(winston.format.timestamp(), winston.format.json(), winston.format.prettyPrint()),
    transports: [
        new winston.transports.File({
            dirname: "e:/logs/",
            filename: `debug${new Date().toISOString().split('T')[0]}.log`,
            level: "info",
        }),
        new winston.transports.Console(),
        new wm.MongoDB({
            db: config.mongoDB,
            level: "info",
            collection: "err",
            options: {
                useUnifiedTopology: true
            }
        })
    ],
    */
    dynamicMeta: (req: express.Request, res: express.Response, err: Error): any => {
        let response = {
            response: {
                origin_ipv6: req.ip.indexOf(':') >= 0 ? req.ip.substring(0, req.ip.lastIndexOf(':')) : req.ip,
                origin_ipv4: req.ip.indexOf(':') >= 0 ? req.ip.substring(req.ip.lastIndexOf(':') + 1) : req.ip,
                headers: JSON.parse(JSON.stringify(res.getHeaders())), // Evita [Object: null prototype]
                status: `${res.statusCode}: ${res.statusMessage}`,
                body: res.body,
                local_date: new Date().toLocaleString()
            }
        }
        return response;
    },
    requestWhitelist: ['headers', 'query', 'params', 'route.path', 'body'],
    responseWhitelist: ['body'],
    responseField: "response",
    requestField: "request",
    metaField: "metadata",
    baseMeta: {},
    winstonInstance: logger
})

export const errorLogger = expressWinston.errorLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            dirname: "e:/logs/",
            filename: `errors_${new Date().toISOString().split('T')[0]}.log`,
            level: "error",
        }),
    ],
    format: winston.format.combine(winston.format.timestamp(), winston.format.json(), winston.format.prettyPrint()),
})