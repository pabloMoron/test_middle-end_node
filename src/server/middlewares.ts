import * as express from "express"

export const prevMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    console.log("previous")
    next()
}
export const postMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    console.log("post")
    next()
}

export const requestLogger = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    console.log(req.headers)
    console.log(req.originalUrl)
    console.log(req.body)
    next()
}
