import Axios from "axios";
import * as express from "express"
import { DATA_SOURCES, IISessionRequest, Source } from "../middlewares/passport"
import * as error from "../server/error"
import { IItemDescription } from "./items";



export async function findItemDescription(req: IISessionRequest, res: express.Response) {
    try {
        const itemDesc = await findItemDescriptionById(req.user, req.params.id)
        res.json(itemDesc)
    }
    catch (exception) {
        error.handle(res, exception)
    }
}

async function findItemDescriptionById(source: Source, id: string): Promise<IItemDescription> {
    return new Promise<IItemDescription>((resolve, reject) => {
        validateDescriptionRequest(id)
            .then(async () => {
                let strateggy = new DescriptionStrategyFactory().getStrategy(source)
                const description = await strateggy.FindDescription(id)
                resolve(description)
            })
            .catch(exception => reject(exception))
    })
}

function validateDescriptionRequest(id: string): Promise<void> {
    const result: error.ValidationErrorMessage = {
        messages: []
    }

    //id validation
    const regex = new RegExp("[^A-Za-z0-9]")
    if (!id || id.length <= 0) {
        result.messages.push({
            path: "id",
            message: "cannot be null"
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
    return Promise.resolve()
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
            let item_res =  Axios.get(`https://api.mercadolibre.com/items/${id}/`)
            let desc_res = Axios.get(`https://api.mercadolibre.com/items/${id}/description`)
            let promises = []
            promises.push(item_res)
            promises.push(desc_res)

            Promise.all(promises)
            .then(([item, desc])=>{
            resolve( 
                {
                author:{
                    lastname: "Moron",
                    name: "Pablo Gabriel"
                },
                item:{
                    id: item.data.id,
                    title: item.data.title,
                    description: desc.data.plain_text,
                    condition: item.data.condition,
                    picture: item.data.pictures[0].secure_url || "",
                    free_shipping: item.data.shipping.free_shipping,//res.freeshipping
                    price: {
                        amount: item.data.original_price,
                        currency: item.data.currency_id,
                        decimals: 2// Que quiere decir? los decimales de la moneda o del precio
                    }, 
                    sold_quantity: item.data.sold_quantity
                }
            })                
        }).catch(err=>reject(err))
        })
    }
}

