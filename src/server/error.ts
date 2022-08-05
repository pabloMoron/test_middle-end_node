import * as express from "express"

export function handle404(req: express.Request, res: express.Response) {
    res.status(404);
    res.json({
        url: req.originalUrl,
        error: "Not Found"
    })
}

export function errorHandler(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!err) return next()
    
    res.status(err.status || 500)
    res.send({
        error: err.message
    })
}