"use strict"

import * as dotenv from "dotenv"
let config: IConfig

export function getConfig(): IConfig {
    if (!config) {
        dotenv.config({ path: `.env` })
        config = {
            port: process.env.PORT || "9000",
            logLevel: process.env.LOG_LEVEL || "info",
            mongoDB: process.env.MONGODB || "mongodb://localhost:27017/authentication",
            host: process.env.HOST || "localhost",
            api_key_mock: process.env.API_KEY_MOCK || "55a4639f-55e8-4e14-a6cc-b79977b20a4e",
            api_key_ml: process.env.API_KEY_ML || "e962f81a-4d42-4eb3-86cd-a25e7237c8dc"
        }
    }
    return config
}

export interface IConfig {
    port: string,
    logLevel: string, //"debug" | "verbose" | "info" | "warn" | "error"
    mongoDB: string,
    host: string,
    api_key_mock: string,
    api_key_ml: string,
}