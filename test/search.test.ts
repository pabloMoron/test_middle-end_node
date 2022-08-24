import * as searchServices from "../src/services/search"
import { result } from "../src/services/search/result"
import axios from "axios"
import { DATA_SOURCES } from "../src/middlewares/passport"
import { Source } from "../src/middlewares/passport"

const baseUrl = "http://localhost:9000/api/sites"
axios.defaults.adapter = require("axios/lib/adapters/http")

describe("Search endpoint", () => {
  it("Mock result", async () => {
    const searchParams: searchServices.ISearchParams = {
      limit: 1,
      offset: 1,
      query: "test",
      site: "MLA",
      sort: "price_asc",
    }
    const datasource: Source = { data_source: DATA_SOURCES.MOCK }
    const mockResult = await searchServices.search(searchParams, datasource)
    expect(mockResult).toEqual(result)
  })

  it("ML result", async () => {
    const searchParams: searchServices.ISearchParams = {
      limit: 1,
      offset: 1,
      query: "Televisor",
      site: "MLA",
      sort: "price_asc",
    }
    const datasource: Source = {
      data_source: DATA_SOURCES.API,
    }
    const mlResult = await searchServices.search(searchParams, datasource)

    expect(mlResult).toBeDefined()
  })

  it("Limit zero", async () => {
    const searchParams: searchServices.ISearchParams = {
      limit: 0,
      offset: 1,
      query: "Televisor",
      site: "MLA",
      sort: "price_asc",
    }
    const datasource: Source = { data_source: DATA_SOURCES.MOCK }

    let expectedValidation = {
      messages: [
        {
          path: "limit",
          message: "must be greater than zero (0)",
        },
      ],
    }
    searchServices.search(searchParams, datasource).catch((error) => {
      expect(error).toEqual(expectedValidation)
    })
  })

  it("Out of range limit", async () => {
    const searchParams: searchServices.ISearchParams = {
      limit: 51,
      offset: 1,
      query: "Televisor",
      site: "MLA",
      sort: "price_asc",
    }
    const datasource: Source = { data_source: DATA_SOURCES.MOCK }

    let expectedValidation = {
      messages: [
        {
          path: "limit",
          message: "maximum value allowed is fifty (50)",
        },
      ],
    }
    searchServices.search(searchParams, datasource).catch((error) => {
      expect(error).toEqual(expectedValidation)
    })
  })

  it("Offset zero", async () => {
    const searchParams: searchServices.ISearchParams = {
      limit: 1,
      offset: 0,
      query: "Televisor",
      site: "MLA",
      sort: "price_asc",
    }
    const datasource: Source = { data_source: DATA_SOURCES.MOCK }

    let expectedValidation = {
      messages: [
        {
          path: "offset",
          message: "must be greater than zero (0)",
        },
      ],
    }
    searchServices.search(searchParams, datasource).catch((error) => {
      expect(error).toEqual(expectedValidation)
    })
  })

  it("Out of range offset", async () => {
    const searchParams: searchServices.ISearchParams = {
      limit: 1,
      offset: 1001,
      query: "Televisor",
      site: "MLA",
      sort: "price_asc",
    }
    const datasource: Source = { data_source: DATA_SOURCES.MOCK }

    let expectedValidation = {
      messages: [
        {
          path: "offset",
          message: "maximum value allowed is one thousand (1000)",
        },
      ],
    }
    searchServices.search(searchParams, datasource).catch((error) => {
      error
      expect(error).toEqual(expectedValidation)
    })
  })

  it("Void query", async () => {
    const searchParams: searchServices.ISearchParams = {
      limit: 1,
      offset: 1,
      query: "",
      site: "MLA",
      sort: "price_asc",
    }
    const datasource: Source = { data_source: DATA_SOURCES.MOCK }
    let expectedValidation = {
      messages: [
        {
          path: "q",
          message: "q is necesary",
        },
      ],
    }
    searchServices.search(searchParams, datasource).catch((error) => {
      expect(error).toEqual(expectedValidation)
    })
  })

  it("Invalid site", async () => {
    const searchParams: searchServices.ISearchParams = {
      limit: 1,
      offset: 1,
      query: "Televisor",
      site: "test",
      sort: "price_asc",
    }
    const datasource: Source = { data_source: DATA_SOURCES.MOCK }
    let expectedValidation = {
      messages: [
        {
          path: "site",
          message: "not valid site",
        },
      ],
    }

    searchServices.search(searchParams, datasource).catch((error) => {
      expect(error).toEqual(expectedValidation)
    })
  })

  it("Invalid sort", async () => {
    const searchParams: searchServices.ISearchParams = {
      limit: 1,
      offset: 1,
      query: "Televisor",
      site: "MLA",
      sort: "test",
    }
    const datasource: Source = { data_source: DATA_SOURCES.MOCK }

    let expectedValidation = {
      messages: [
        {
          path: "sort",
          message: "not valid sort method",
        },
      ],
    }
    searchServices.search(searchParams, datasource).catch((error) => {
      expect(error).toEqual(expectedValidation)
    })
  })
})
