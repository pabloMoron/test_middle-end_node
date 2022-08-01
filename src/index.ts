"use strict"

import express from "express";
import * as routes from "./routes/itemRoute"
import { getConfig, IConfig } from "./server/environment";
import { initialize } from "./server/express";
import * as morgan from "morgan"

const config: IConfig  = getConfig("local")
const app = initialize(config)
if(config.logLevel === "debug"){
    app.use(morgan.default("dev"))
}
app.listen(3000, () => {
    console.log("app initialized");
})

