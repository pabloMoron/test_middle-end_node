import { expect } from "chai"
import nock = require("nock")
import { describe, it } from "node:test"
import { result } from "../src/services/items/result"
import axios from "axios"

const baseUrl = "http://localhost:9000/api"
const itemsPath = "/items/"
const itemId = "test"
const MLitemId = "MLA828124271"
const invalidId = "_MLA828124271"

describe("Items endpoint", () => {
    it("Mock result", async () => {
        nock(baseUrl, {
            reqheaders: {
                "x-auth-token": "55a4639f-55e8-4e14-a6cc-b79977b20a4e"
            },
            allowUnmocked: true
        })
            .get(`${itemsPath}${itemId}`)
            .reply(200, result)

        const res = await axios.get(`${baseUrl}${itemsPath}${itemId}`, {
            headers: {
                "x-auth-token": "55a4639f-55e8-4e14-a6cc-b79977b20a4e"
            }
        })
        expect(res.data).to.deep.equals(result)
    })

    it("ML result", async () => {
        nock(baseUrl, {
            reqheaders: {
                "x-auth-token": "e962f81a-4d42-4eb3-86cd-a25e7237c8dc"
            }
        })
            .get(`${itemsPath}${MLitemId}`)
            .reply(200, result)

        const res = await axios.get(`${baseUrl}${itemsPath}${MLitemId}`, {
            headers: {
                "x-auth-token": "e962f81a-4d42-4eb3-86cd-a25e7237c8dc"
            }
        })
        expect(res.data).to.deep.equals(result)
    })

    it("Invalid Id", async () => {
        nock(baseUrl, {
            allowUnmocked: true
        })
            .get(`/`)

        nock.restore()
        let expectedValidation = {
            messages: [{
                path: "id",
                message: "numbers and letters only"
            }]
        }

        await axios.get(`${baseUrl}${itemsPath}${invalidId}`, {
            headers: {
                "x-auth-token": "e962f81a-4d42-4eb3-86cd-a25e7237c8dc"
            }
        })
            .catch((error) => {
                expect(error.response.status).to.equals(400)
                expect(error.response.data).to.deep.equals(expectedValidation)
            })
    })

    it("Invalid Token", async () => {
        nock(baseUrl, {
            allowUnmocked: true
        })
            .get(`/`)

        let expectedError = {
            error: "invalid token"
        }

        await axios.get(`${baseUrl}${itemsPath}${invalidId}`, {
            headers: {
                "x-auth-token": "test token"
            }
        })
            .catch((error) => {
                expect(error.response.status).to.equals(401)
                expect(error.response.data).to.deep.equals(expectedError)
            })
    })

    it("No Token, 400 bad request", async () => {
        nock(baseUrl, {
            allowUnmocked: true
        })
            .get(`/`)

        let expectedMessage = "Bad Request"

        await axios.get(`${baseUrl}${itemsPath}${invalidId}`, {

        })
            .catch((error) => {
                expect(error.response.status).to.equals(400)
                expect(error.response.data).to.deep.equals(expectedMessage)
            })
    })
})