import { Collection, Document, model, Schema } from "mongoose"
import { Source } from "../middlewares/passport";
import * as express from "express"

export interface IItem {
    name: string
}


export interface IItemDescriptionRequest extends express.Request {
    user: { source: Source };
}

export interface IItemDescriptionResponse {
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