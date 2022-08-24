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
    maxSize: "10k",
    extension: ".log",
    maxFiles: "3",
    dirname: p.resolve(__dirname,"..","..","logs")
}).on("archive", copyLogFile);

// Ignorar el log de swagger
const ignoredRoutes = ["/api/swagger/",
"/api/swagger/swagger-ui.css",
"/api/swagger/swagger-ui-bundle.js",
"/api/swagger/swagger-ui-standalone-preset.js",
"/api/swagger/swagger-ui-init.js",
"/api/swagger/favicon-32x32.png"]

const infoLogger = winston.createLogger({
    format: winston.format.combine(winston.format.timestamp(), winston.format.json(), winston.format.prettyPrint()),
    transports: [
        infoTransport,
        new winston.transports.Console
    ]
})

// cuando se archivan los logs los comprime los muevo del directorio
function copyLogFile(logname: string) {
    const archive_logs = p.join(__dirname,".." , "..", "archive_logs");
    const dest_path = p.join(archive_logs, p.basename(logname))
    if (!fs.existsSync(archive_logs)) {
        fs.mkdirSync(archive_logs)
    }
    fs.copyFileSync(logname, dest_path)
}



//WINSTON EXPRESS MIDDLEWARE
export const requestLogger = expressWinston.logger({
    msg: undefined,
    //res: any porque la interfaz Response de Express no tiene declarada la propiedad body
    dynamicMeta: (req: express.Request, res: any, err: Error): any => {
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
    ignoredRoutes:ignoredRoutes,
    winstonInstance: infoLogger
})