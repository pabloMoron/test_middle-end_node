import { Source } from "../middlewares/passport";
import * as express from "express"

export interface IISessionRequest extends express.Request {
    user: { source: Source };
}

export interface IItemDescription {
    author: {
        name: String
        lastname: String
    },
    item: {
        id: String,
        title: String,
        price: {
            currency: String,
            amount: Number,
            decimals: Number,
        },
        picture: String,
        condition: String,
        free_shipping: Boolean,
        sold_quantity: Number
        description: String
    }
}