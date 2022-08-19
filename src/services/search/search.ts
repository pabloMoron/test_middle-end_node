"use strict"

// Interfaces para para los tipos
export interface ISearchParams {
    limit: number,
    offset: number,
    query: string,
    site: string
    sort: string,
}

export interface ISearchResult {
    paging: {
        total: Number
        offset: Number
        limit: Number
    },
    categories: Array<String>,
    items: Array<searchItem>
}

interface searchItem {
    id: String,
    title: String,
    price: {
        currency: String,
        amount: Number,
        decimals: Number
    },
    picture: String,
    condition: String,
    free_shipping: Boolean
}