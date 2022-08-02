"use strict"

import express from "express";
import * as routes from "./routes/itemRoute"
import { getConfig, IConfig } from "./server/environment";
import { initialize } from "./server/express";
import * as morgan from "morgan"
import { logRequest } from "./Logger/logger";

const config: IConfig  = getConfig("develop")
const app = initialize(config)
app.use(logRequest)
if(config.logLevel === "debug"){
    app.use(morgan.default("dev"))
}
app.listen(config.port, () => {
    console.log(`app initialized at port ${config.port}`);
})

