import { handle, ValidationErrorMessage } from "../server/error"
import { Response } from "express"
import axios from "axios"
import { ISearchRequest, ISearchResult } from "./search"
import { DATA_SOURCES, Source, IISessionRequest } from "../middlewares/passport"
import { result } from "./result"



//#region Implementar patron Factory y Strategy
interface IDescriptionStrategy {
    SearchItems(searchRequest: ISearchRequest): Promise<ISearchResult>
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
    async SearchItems(searchRequest: ISearchRequest): Promise<ISearchResult> {
        return new Promise<ISearchResult>(async (resolve, reject)=>{
            try {
                let url = new URL(`https://api.mercadolibre.com/sites/${searchRequest.site}/search?q=${searchRequest.query}`)
                if (searchRequest.limit) url.searchParams.append("limit", searchRequest.limit.toString())
                if (searchRequest.offset) url.searchParams.append("offset", searchRequest.offset.toString())
                if (searchRequest.sort) url.searchParams.append("sort", searchRequest.sort)
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
    
                return resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    }

}

class MockSearchStrategy implements IDescriptionStrategy {
    async SearchItems(searchRequest: ISearchRequest): Promise<ISearchResult> {
        return Promise.resolve(result)
    }

}
//#endregion Implementar patron Factory y Strategy
export async function searchItems(req: IISessionRequest, res: Response) {

    try {
        let searchRequest: ISearchRequest = {
            limit: parseInt(req.query.limit as string),
            offset: parseInt(req.query.offset as string),
            query: req.query.q as string,
            site: req.params.site as string,
            sort: req.query.sort as string
        }

        await validateSearchRequest(searchRequest)
        let searchStrategy = new SearchStrategyFactory().getStrategy(req.user)
        let result = await searchStrategy.SearchItems(searchRequest)

        res.json(result)
    } catch (err) {
        handle(res, err)
    }
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

function validateSearchRequest(req: ISearchRequest): Promise<void> {
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
        return Promise.reject(result)
    }
    return Promise.resolve()
}