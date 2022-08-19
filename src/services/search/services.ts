"use strict"

import {  ValidationErrorMessage } from "../../server/error"
import axios from "axios"
import { ISearchParams, ISearchResult } from "./search"
import { DATA_SOURCES, Source } from "../../middlewares/passport"
import { result } from "./result"

export async function a (searchParams: ISearchParams, dataSource: Source): Promise<ISearchResult> {
    validateSearchRequest(searchParams)
    let searchStrategy = new SearchStrategyFactory().getStrategy(dataSource)
    let result = await searchStrategy.SearchItems(searchParams)
    return result
}

enum SortValues {
    price_asc,
    price_desc
}

enum AllowedSites {
    MLA,
    MLB,
    MLC
}

function validateSearchRequest(req: ISearchParams): void {
    const result = new ValidationErrorMessage()
    result.messages = []
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
        throw (result)
    }
}

//#region Implementar patron Factory y Strategy
interface IDescriptionStrategy {
    SearchItems(searchParams: ISearchParams): Promise<ISearchResult>
}

class SearchStrategyFactory {
    getStrategy(source: Source): IDescriptionStrategy {
        if (source.data_source == DATA_SOURCES.API) {
            return new MLSearchStrategy()
        }
        if (source.data_source == DATA_SOURCES.MOCK) {
            return new MockSearchStrategy()
        }
        throw ("NO STRATEGY")
    }
}

class MLSearchStrategy implements IDescriptionStrategy {
    async SearchItems(searchParams: ISearchParams): Promise<ISearchResult> {
        try {
            let url = new URL(`https://api.mercadolibre.com/sites/${searchParams.site}/search?q=${searchParams.query}`)
            if (searchParams.limit) url.searchParams.append("limit", searchParams.limit.toString())
            if (searchParams.offset) url.searchParams.append("offset", searchParams.offset.toString())
            if (searchParams.sort) url.searchParams.append("sort", searchParams.sort)
            let response = await axios.get(url.href)

            let items = response.data.results.map((x: any) =>
            ({
                id: x.id,
                title: x.title,
                price: {
                    currency: x.prices.prices[0].currency_id,
                    amount: x.prices.prices[0].amount,
                    decimals: 2
                },
                picture: x.thumbnail,
                condition: x.condition,
                free_shipping: x.shipping.free_shipping,
            })
            )
            let result: ISearchResult = {
                paging: {
                    total: response.data.paging.total,
                    offset: response.data.paging.offset,
                    limit: response.data.paging.limit
                },
                categories: [""],
                items: items,
            }
            return (result)
        } catch (error) {
            throw error
        }
    }
}

class MockSearchStrategy implements IDescriptionStrategy {
    async SearchItems(searchParams: ISearchParams): Promise<ISearchResult> {
        return (result)
    }
}
//#endregion Implementar patron Factory y Strategy