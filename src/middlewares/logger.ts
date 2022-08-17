import * as express from "express"
import * as expressWinston from "express-winston"
import * as winston from "winston"
import "winston-daily-rotate-file"
import * as fs from "fs"
import * as p from "path"

const infoTransport = new winston.transports.DailyRotateFile({
    filename: `app_${new Date().toISOString().split("T")[0]}`,
    datePattern: "HH",
    zippedArchive: true,
    maxSize: "10m",
    extension: ".log",
    maxFiles: "14d",
    dirname: "e:\\logs"
}).on("archive", copyLogFile);

const errTransport = new winston.transports.DailyRotateFile({
    filename: `app_error_${new Date().toISOString().split("T")[0]}`,
    datePattern: "DD",
    zippedArchive: true,
    maxSize: "1m",
    extension: ".log",
    maxFiles: "14d",
    dirname: "e:\\logs"
}).on("archive", copyLogFile)

const infoLogger = winston.createLogger({
    format: winston.format.combine(winston.format.timestamp(), winston.format.json(), winston.format.prettyPrint()),
    transports: [
        infoTransport
    ]
})

function copyLogFile(logname: string) {
    const archive_logs = p.join(__dirname, "..", "archive_logs");
    const dest_path = p.join(archive_logs, p.basename(logname))
    if (!fs.existsSync(archive_logs)) {
        fs.mkdirSync(archive_logs)
    }
    fs.copyFileSync(logname, dest_path)
}

let errLogger = winston.createLogger({
    transports: [
        errTransport
    ],
    format: winston.format.combine(winston.format.timestamp(), winston.format.json(), winston.format.prettyPrint()),
})

//WINSTON EXPRESS MIDDLEWARE
export const requestLogger = expressWinston.logger({
    msg: undefined,
    dynamicMeta: (req: express.Request, res: express.Response, err: Error): any => {
        let response = {
            response: {
                origin_ipv6: req.ip.indexOf(":") >= 0 ? req.ip.substring(0, req.ip.lastIndexOf(":")) : req.ip,
                origin_ipv4: req.ip.indexOf(":") >= 0 ? req.ip.substring(req.ip.lastIndexOf(":") + 1) : req.ip,
                headers: JSON.parse(JSON.stringify(res.getHeaders())), // Evita [Object: null prototype]
                status: `${res.statusCode}: ${res.statusMessage}`,
                local_date: new Date().toLocaleString(),
                body: res.body

            }
        }
        return response;
    },
    requestWhitelist: ["headers", "query", "params", "route.path", "body"],
    responseWhitelist: ["body"],
    responseField: "response",
    requestField: "request",
    metaField: "metadata",
    baseMeta: {},
    winstonInstance: infoLogger
})

//WINSTON ERROR LOGGER
export const errorLogger = expressWinston.errorLogger({
    msg: undefined,
    dynamicMeta: (req: express.Request, res: express.Response, err: Error): any => {
        let response = {
            response: {
                origin_ipv6: req.ip.indexOf(":") >= 0 ? req.ip.substring(0, req.ip.lastIndexOf(":")) : req.ip,
                origin_ipv4: req.ip.indexOf(":") >= 0 ? req.ip.substring(req.ip.lastIndexOf(":") + 1) : req.ip,
                headers: JSON.parse(JSON.stringify(res.getHeaders())), // Evita [Object: null prototype]
                status: `${res.statusCode}: ${res.statusMessage}`,
                body: res.body,
                local_date: new Date().toLocaleString()
            }
        }
        return response;
    },
    requestWhitelist: ["headers", "query", "params", "route.path", "body"],
    responseField: "response",
    requestField: "request",
    metaField: "metadata",
    baseMeta: {},
    winstonInstance: errLogger
})

