import * as httpMocks from "node-mocks-http"
import * as error from "../src/server/error"

describe("Test de errores", () => {
  it("handle404", () => {
    const req = httpMocks.createRequest()
    const res = httpMocks.createResponse()

    req.originalUrl = "test"
    error.handle404(req, res)
    expect(res.statusCode).toEqual(404)
    expect(res._getData()).toEqual('{"url":"test","error":"Not Found"}')
  })

  it("handleUnknownError", () => {
    const res = httpMocks.createResponse()
    let testerror = {
      message: "message_unknown error",
      name: "name_unknown error",
    }
    error.handle(res, testerror)
    expect(res.statusCode).toEqual(500)
    expect(res._getJSONData().error.message).toEqual("message_unknown error")
    expect(res._getJSONData().error.name).toEqual("name_unknown error")
  })

  it("handleUnknownError", () => {
    const res = httpMocks.createResponse()

    const err = {
      message: "invalid token",
      status: 401,
    }

    const req = httpMocks.createRequest()
    error.errorHandler(err, req, res, () => {})
    expect(res.statusCode).toEqual(401)
    expect(res._getJSONData().error).toEqual("invalid token")
  })

  it("ValidationError", () => {
    const res = httpMocks.createResponse()

    let validationError = new error.ValidationErrorMessage()
    Object.assign(validationError, {
      code: 400,
      error: "validation error",
      messages: [
        {
          message: "test validation 1",
          path: "test path 1",
        },
        {
          message: "test validation 2",
          path: "test path 2",
        },
      ],
    })
    error.handle(res, validationError)

    expect(res.statusCode).toEqual(400)
    expect(res._getJSONData().messages.length).toEqual(2)
  })
})
