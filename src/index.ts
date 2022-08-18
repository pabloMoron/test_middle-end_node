"use strict"

import * as environment from "./server/environment";
import * as express from "./server/express";

const config: environment.IConfig  = environment.getConfig()
const app = express.initialize(config)

app.listen(config.port, () => {
    console.log(`app initialized at port ${config.port}`);
})

