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

export function handle(res: express.Response, err: any): express.Response {
    if (err instanceof ValidationErrorMessage) {
      // ValidationErrorMessage
      if (err.code) {
        res.status(err.code);
      } else {
        res.status(400);
      }
      const send: any = {};
      if (err.error) {
        send.error = err.error;
      }
      if (err.messages) {
        send.messages = err.messages;
      }
  
      return res.send(send);
    } else {
      return res.send(sendUnknown(res, err));
    }
  }

  function sendUnknown(res: express.Response, err: any): ValidationErrorMessage {
    res.status(500);
    return { error: err };
  }

export class ValidationErrorMessage {
    code?: number;
    error?: string;
    messages?: ValidationErrorItem []
}

export class ValidationErrorItem{
    path: string;
    message: string
}
export function newArgumentError(argument: string, err: string): ValidationErrorMessage {
    const result = new ValidationErrorMessage();
    result.messages = [{
      path: argument,
      message: err
    }];
    return result;
  }
  
  export function newError(code: number, err: string): ValidationErrorMessage {
    const result = new ValidationErrorMessage();
    result.code = code;
    result.error = err;
    return result;
  }