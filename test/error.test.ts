import { expect } from "chai"
import { describe, it } from "node:test"
import * as httpMocks from "node-mocks-http"
import { handle404, handle, ValidationErrorMessage } from "../src/server/error"

describe("Test de errores", () => {
    it("handle404", () => {
        const req = httpMocks.createRequest()
        const res = httpMocks.createResponse()

        req.originalUrl = "test"
        handle404(req, res)
        expect(res.statusCode).equal(404)
        expect(res._getData()).equal('{"url":"test","error":"Not Found"}');
    })

    it("handleUnknownError", () => {
        const res = httpMocks.createResponse()
        let error = {
            message: "message_unknown error",
            name: "name_unknown error"
        }
        handle(res, error)
        expect(res.statusCode).to.equal(500)
        expect(res._getJSONData().error.message).equal("message_unknown error")
        expect(res._getJSONData().error.name).equal("name_unknown error")
    })

    it("ValidationError", () => {
        const res = httpMocks.createResponse()
        
        let validationError = new ValidationErrorMessage()
        Object.assign(validationError, {
            code: 400,
            error: "validation error",
            messages: [
                {
                    message: "test validation 1",
                    path: "test path 1"
                },
                {
                    message: "test validation 2",
                    path: "test path 2"
                }
            ]
        })

        handle(res, validationError)

        expect(res.statusCode).to.equal(400)
        expect(res._getData().messages.length).equal(2)
    })
})