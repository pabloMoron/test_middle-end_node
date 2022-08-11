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
        const itemDesc = await findItemDescriptionById(req.user, req.params.site, req.params.id)
        res.json(itemDesc)
    }
    catch (exception) {
        error.handle(res, exception)
    }
}

async function findItemDescriptionById(source: Source, site: string, id: string): Promise<IItemDescriptionResponse> {
    return new Promise<IItemDescriptionResponse>((resolve, reject) => {
        validateDescriptionRequest(site, id)
            .then(async id => {
                console.log(source)
                let strateggy = new DescriptionStrategyFactory().getStrategy(source)
                const description = await strateggy.FindDescription(id)
                resolve(description)
            })
            .catch(exception => reject(exception))
    })
}

function validateDescriptionRequest(site: string, id: string): Promise<string> {
    const result: error.ValidationErrorMessage = {
        messages: []
    }
    
    //site validation
    if(!["MLA","MLB", "MLC"].includes(site)) {
        result.messages.push({
            path: "site",
            message:"invalid site"
        })
    }

    //id validation
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
        return new Promise<IItemDescription>((resolve, reject)=>{
            let item_res =  Axios.get("https://api.mercadolibre.com/items/MLA1147686760/")
            let desc_res = Axios.get("https://api.mercadolibre.com/items/MLA1147686760/description")
            let promises = []
            promises.push(item_res)
            promises.push(desc_res)

            Promise.all(promises)
            .then(([item, desc])=>{
                console.log(item.data)
                console.log(desc.data)
            resolve( 
                {
                author:{
                    lastname: "Moron",
                    name: "Pablo Gabriel"
                },
                item:{
                    description: desc.data.plain_text,
                    condition: item.data.condition,
                    free_shipping: item.data.shipping.free_shipping,//res.freeshipping
                    id: item.data.id,
                    picture: item.data.pictures[0].secure_url || "",
                    price: {
                        amount: item.data.original_price,
                        currency: item.data.currency_id,
                        decimals: 2// Que quiere decir? los decimales de la moneda o del precio
                    }, 
                    sold_quantity: item.data.sold_quantity,
                    title: item.data.title
                }
            })                
        }).catch(err=>{
            reject(err)
        })
        })
    }
}