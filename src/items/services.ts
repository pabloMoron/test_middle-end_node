import Axios from "axios";
import * as express from "express"
import { DATA_SOURCES, Source } from "../middlewares/passport"
import * as error from "../server/error"
import { IItemDescription } from "./items";

interface IItemDescriptionRequest extends express.Request {
    user: Source;
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

export async function findItemDescription(req: IItemDescriptionRequest, res: express.Response) {
    try {
        const itemDesc = await findItemDescriptionById(req.user, req.params.id)
        res.json(itemDesc)
    }
    catch (exception) {
        error.handle(res, exception)
    }
}

async function findItemDescriptionById(source: Source, id: string): Promise<IItemDescriptionResponse> {
    return new Promise<IItemDescriptionResponse>((resolve, reject) => {
        validateDescriptionRequest(id)
            .then(id => {
                console.log(source)
                let strateggy = new DescriptionStrategyFactory().getStrategy(source)
                const description = strateggy.FindDescription(id)
                resolve(description)
            })
            .catch(exception => reject(exception))
    })
}

function validateDescriptionRequest(id: string): Promise<string> {
    const result: error.ValidationErrorMessage = {
        messages: []
    }
    const regex = new RegExp("[^A-Za-z0-9]")

    if (!id || id.length <= 0) {
        result.messages.push({
            path: "id",
            message: "id cannot be null"
        })
    }

    if (regex.test(id)) {
        result.messages.push({
            path: "id",
            message: "numbers and letters only"
        })
    }

    if (result.messages.length > 0) {
        return Promise.reject(result)
    }
    return Promise.resolve(id)
}


interface IDescriptionStrategy {
    FindDescription(id: string): Promise<IItemDescription>
}

class DescriptionStrategyFactory {
    getStrategy(source: Source): IDescriptionStrategy {
        if (source.data_source == DATA_SOURCES.API) {
            return new MLDescriptionStrategy()
        }
        if (source.data_source == DATA_SOURCES.MOCK) {
            return new MockDescriptionStrategy()
        }
        throw ("NO STRATEGY")
    }
}

class MockDescriptionStrategy implements IDescriptionStrategy {
    FindDescription(id: string): Promise<IItemDescription> {
        console.log("Estoy en la estrategia uwu")
        let result: IItemDescription = {
            author: {
                name: "Pablo",
                lastname: "Moron"
            },
            item: {
                condition: "new",
                description: "DS1 Bonfire paint 30cmx20cm",
                free_shipping: false,
                id: id,
                picture: "http://localhost:9000/ds1_bonfire.jpg",
                price: {
                    amount: 100,
                    currency: "dolars",
                    decimals: 10
                },
                sold_quantity: 1,
                title: "Dark Souls bonfire paint"
            },
        }
        return Promise.resolve(result)
    }
}

class MLDescriptionStrategy implements IDescriptionStrategy {
    async FindDescription(id: string): Promise<IItemDescription> {
        let res =   (await Axios.get("https://api.mercadolibre.com/items/MLA1147686760/description")).data
        
        console.log(res)
        return {
            author:{
                lastname: "res.author.lastname",
                name: "res.author.name"
            },
            item:{
                description: res.plain_text,
                condition: "condition",
                free_shipping: false,//res.freeshipping
                id: "res.id",
                picture: "res.picture",
                price: {
                    amount: 1,//res.price.ammount
                    currency: "res.currency",
                    decimals: 0 //res.price.decimals
                }, 
                sold_quantity: 1,
                title:"res.item.title"
            }
        }
    }
}