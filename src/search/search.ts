export interface ISearchRequest {
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
    categories: [String],
    items: [
        {
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
        },
    ]
}