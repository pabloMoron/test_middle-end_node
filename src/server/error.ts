import * as express from "express"

export function handle404(req: express.Request, res: express.Response) {
    res.status(404);
    res.json({
        url: req.originalUrl,
        error: "Not Found"
    })
}