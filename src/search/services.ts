import { handle, ValidationErrorMessage } from "../server/error"
import { Request, Response } from "express"
import axios from "axios"
import { ISearchRequest } from "./search"

export async function searchItems(req: Request, res: Response) {

    try {
        let searchQuery: ISearchRequest = {
            limit: parseInt(req.query.limit as string),
            offset: parseInt(req.query.offset as string),
            query: req.query.q as string,
            site: req.params.site as string,
            sort: req.query.sort as string
        }
        await validateSearchRequest(searchQuery)
        let site = req.params.site
        let query = req.query.q
        let url = new URL (`https://api.mercadolibre.com/sites/${site}/search?q=${query}`)
        if(searchQuery.limit) url.searchParams.append("limit", searchQuery.limit.toString())
        if(searchQuery.offset) url.searchParams.append("offset", searchQuery.offset.toString())
        if(searchQuery.sort) url.searchParams.append("sort", searchQuery.sort)
        let response = await axios.get(url.href)
        res.json(response.data)

    } catch (err) {
        handle(res, err)
    }
}

enum SortValues {
    PRICE_ASC = "price_asc",
    PRICE_DESC = "price_desc"
}

enum AllowedSites {
    MLA = "MLA",
    MLB = "MLB",
    MLC = "MLC"
}

function validateSearchRequest(req: ISearchRequest): Promise<void> {
    const result: ValidationErrorMessage = {
        messages: []
    }

    if (req.limit && req.limit < 0) {
        result.messages.push(
            {
                path: "limit",
                message: "must be greater than zero (0)"
            }
        )
    }

    if (req.limit && req.limit > 50) {
        result.messages.push(
            {
                path: "limit",
                message: "maximum value allowed is fifty (50)"
            }
        )
    }

    if (req.offset && req.offset < 0) {
        result.messages.push(
            {
                path: "offset",
                message: "must be greater than zero (0)"
            }
        )
    }

    if (req.offset && req.offset > 1000) {
        result.messages.push(
            {
                path: "offset",
                message: "maximum value allowed is one thousand (1000)"
            }
        )
    }

    if (!req.query || req.query === "") {
        result.messages.push(
            {
                path: "q",
                message: "q is necesary"
            }
        )
    }

    if (req.site && !(req.site in AllowedSites)) {
        result.messages.push(
            {
                path: "site",
                message: "not valid site"
            }
        )
    }

    if (req.sort && !(req.sort in SortValues)) {
        result.messages.push(
            {
                path: "sort",
                message: "not valid sort method"
            }
        )
    }

    if (result.messages.length > 0) {
        return Promise.reject(result)
    }
    return Promise.resolve()
}