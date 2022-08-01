import * as dotenv from "dotenv"
let config: IConfig
///environment: "local" | "develop" | "qa" | "production" | ...
export function getConfig(environment: string): IConfig {
    if (!config) {
        dotenv.config({ path: `${environment}.env` })
        config = {
            port: process.env.PORT || "3000",
            logLevel: process.env.LOG_LEVEL || "debug",
            mongoDB: process.env.MONGO_URL || "mongodb://localhost:27017/authentication",
            host: process.env.HOST || "localhost",
        }
    }
    return config
}

export interface IConfig {
    port: string,
    logLevel: string, //"debug" | "verbose" | "info" | "warn" | "error"
    mongoDB: string,
    host: string
}