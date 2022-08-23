import { expect } from "chai"
import nock = require("nock")
import { describe, it } from "node:test"
import { result } from "../src/services/search/result"
import axios from "axios"

const baseUrl = "http://localhost:9000/api/sites"
const query = "test"
const MLitemId = "MLA828124271"
const invalidQuery = "_MLA828124271"

describe("Search endpoint", () => {
    it("Mock result", async () => {
        nock(baseUrl, {

            allowUnmocked: true
        })
            .get(`/MLA/search`)
            .query({
                q: "test"
            })
            .reply(200, result)

        const res = await axios.get(`${baseUrl}/MLA/search?q=test`, {
            headers: {
                "x-auth-token": "55a4639f-55e8-4e14-a6cc-b79977b20a4e"
            }
        })
        expect(res.status).equals(200)
        expect(res.data).to.deep.equals(result)
    })

    it("ML result", async () => {
        nock(baseUrl, {
            reqheaders: {
                "x-auth-token": "e962f81a-4d42-4eb3-86cd-a25e7237c8dc"
            }
        })
            .get(`/MLA/search`)
            .query({
                q: "Televisor"
            })
            .reply(200, result)

        const res = await axios.get(`${baseUrl}/MLA/search?q=Televisor`, {
            headers: {
                "x-auth-token": "e962f81a-4d42-4eb3-86cd-a25e7237c8dc"
            }
        })
        expect(res.status).equals(200)
        expect(res.data).to.deep.equals(result)
    })

    it("Limit zero", async () => {
        nock(baseUrl)
            .get(`/MLA/search`)
            .query({
                q: "Televisor",
                limit: "0"
            })

        let expectedValidation = {
            messages: [{
                path: "limit",
                message: "must be greater than zero (0)"
            }]
        }

        await axios.get(`${baseUrl}/MLA/search?q=Televisor&limit=0`, {
            headers: {
                "x-auth-token": "e962f81a-4d42-4eb3-86cd-a25e7237c8dc"
            }
        })
            .catch((err) => {
                let errorResponse = err.response
                console.log(errorResponse.data)
                expect(errorResponse.status).to.equals(400)
                expect(errorResponse.data).to.deep.equals(expectedValidation)
            })
    })

    it("Out of range limit", async () => {
        nock(baseUrl)
            .get(`/MLA/search`)
            .query({
                q: "Televisor",
                limit: "51"
            })
        let expectedValidation = {
            messages: [{
                path: "limit",
                message: "maximum value allowed is fifty (50)"
            }]
        }

        await axios.get(`${baseUrl}/MLA/search?q=Televisor&limit=51`, {
            headers: {
                "x-auth-token": "e962f81a-4d42-4eb3-86cd-a25e7237c8dc"
            }
        })
            .catch((err) => {
                let error = err.response
                console.log(error.data)
                expect(error.status).to.equals(400)
                expect(error.data).to.deep.equals(expectedValidation)
            })
    })

    it("Offset zero", async () => {
        nock(baseUrl)
            .get(`/MLA/search`)
            .query({
                q: "Televisor",
                offset: "0"
            })
        let expectedValidation = {
            messages: [{
                path: "offset",
                message: "must be greater than zero (0)"
            }]
        }

        await axios.get(`${baseUrl}/MLA/search?q=Televisor&offset=0`, {
            headers: {
                "x-auth-token": "e962f81a-4d42-4eb3-86cd-a25e7237c8dc"
            }
        })
            .catch((err) => {
                let error = err.response
                console.log(error.data)
                expect(error.status).to.equals(400)
                expect(error.data).to.deep.equals(expectedValidation)
            })
    })

    it("Out of range offset", async () => {
        nock(baseUrl)
            .get(`/MLA/search`)
            .query({
                q: "Televisor",
                offset: "1001"
            })
        let expectedValidation = {
            messages: [{
                path: "offset",
                message: "maximum value allowed is one thousand (1000)"
            }]
        }

        await axios.get(`${baseUrl}/MLA/search?q=Televisor&offset=1001`, {
            headers: {
                "x-auth-token": "e962f81a-4d42-4eb3-86cd-a25e7237c8dc"
            }
        })
            .catch((err) => {
                let error = err.response
                console.log(error.data)
                expect(error.status).to.equals(400)
                expect(error.data).to.deep.equals(expectedValidation)
            })
    })

    it("Void query", async () => {

        let expectedValidation = {
            messages: [{
                path: "q",
                message: "q is necesary"
            }]
        }

        await axios.get(`${baseUrl}/MLA/search?q= `, {
            headers: {
                "x-auth-token": "e962f81a-4d42-4eb3-86cd-a25e7237c8dc"
            }
        })
            .catch((err) => {
                let error = err.response
                console.log(error.data)
                expect(error.status).to.equals(400)
                expect(error.data).to.deep.equals(expectedValidation)
            })
    })

    it("Invalid site", async () => {
        nock(baseUrl)
            .get(`/test/search`)
            .query({
                q: "Televisor",
            })
        let expectedValidation = {
            messages: [{
                path: "site",
                message: "not valid site"
            }]
        }

        await axios.get(`${baseUrl}/test/search?q=Televisor`, {
            headers: {
                "x-auth-token": "e962f81a-4d42-4eb3-86cd-a25e7237c8dc"
            }
        })
            .catch((err) => {
                let error = err.response
                console.log(error.data)
                expect(error.status).to.equals(400)
                expect(error.data).to.deep.equals(expectedValidation)
            })
    })

    it("Invalid sort", async () => {
        nock(baseUrl + "/MLA")
            .get(`/search`)
            .query({
                q: "Televisor",
                sort: "test"
            })
        let expectedValidation = {
            messages: [{
                path: "sort",
                message: "not valid sort method"
            }]
        }
        console.log(nock.isActive())
        await axios.get(`${baseUrl}/MLB/search?q=Televisor&sort=test`, {
            headers: {
                "x-auth-token": "e962f81a-4d42-4eb3-86cd-a25e7237c8dc"
            }
        })
            .catch((err) => {
                let error = err.response
                console.log(error.data)
                expect(error.status).to.equals(400)
                expect(error.data).to.deep.equals(expectedValidation)
            })
    })
})