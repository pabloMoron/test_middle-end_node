const nock = require("nock")
import { result } from "../src/services/items/result"
import axios from "axios"
import * as itemServices from "../src/services/items"
import { Source } from "../src/middlewares/passport"
import { DATA_SOURCES } from "../src/middlewares/passport"

const baseUrl = "http://localhost:9000/api"
const itemsPath = "/items/"
const itemId = "test"
const MLitemId = "MLA828124271"

axios.defaults.adapter = require("axios/lib/adapters/http")
describe("Items endpoint", () => {
  it("Mock result", async () => {
    const datasource: Source = {
      data_source: DATA_SOURCES.MOCK,
    }
    const mockResult = await itemServices.findItemDescriptionById(
      datasource,
      MLitemId
    )
    expect(mockResult).toEqual(result)
  })

  it("ML result", async () => {
    const datasource: Source = {
      data_source: DATA_SOURCES.API,
    }
    const mlResult = await itemServices.findItemDescriptionById(
      datasource,
      MLitemId
    )

    expect(mlResult).toBeDefined()
  })

  it("Invalid Id", async () => {
    //Evito nock
    nock.restore()
    let expectedValidation = {
      messages: [
        {
          path: "id",
          message: "numbers and letters only",
        },
      ],
    }

    const invalidId = "_MLA828124271"
    const datasource: Source = {
      data_source: DATA_SOURCES.MOCK,
    }
    itemServices.findItemDescriptionById(datasource, invalidId).catch((err) => {
      expect(err).toEqual(expectedValidation)
    })
  })

  it("Null Id", async () => {
    //Evito nock
    nock.restore()
    let expectedValidation = {
      messages: [
        {
          path: "id",
          message: "cannot be null",
        },
      ],
    }

    const invalidId = ""
    const datasource: Source = {
      data_source: DATA_SOURCES.MOCK,
    }
    itemServices.findItemDescriptionById(datasource, invalidId).catch((err) => {
      expect(err).toEqual(expectedValidation)
    })
  })

  it("Invalid Token", async () => {
    nock.activate()
    nock(baseUrl, {
      reqheaders: {
        "x-auth-token": "test",
      },
    })
      .persist()
      .get(`${itemsPath}test`)
      .reply(401, {
        error: "invalid token",
      })
    let expectedError = {
      error: "invalid token",
    }

    await axios
      .get(`${baseUrl}${itemsPath}${itemId}`, {
        headers: {
          "x-auth-token": "test",
        },
      })
      .catch((error) => {
        const err = error
        expect(err.response.status).toEqual(401)
        expect(err.response.data).toEqual(expectedError)
      })
  })

  it("No Token, 400 bad request", async () => {
    nock(baseUrl, {
      reqheaders: {
        
      },
    })
      .persist()
      .get(`${itemsPath}test`)
      .reply(400, "Bad Request")
    let expectedMessage = "Bad Request"

    await axios
      .get(`${baseUrl}${itemsPath}${itemId}`, {

      })
      .catch((error) => {
        const err = error
        expect(err.response.status).toEqual(400)
        expect(err.response.data).toEqual(expectedMessage)
      })
  })
})