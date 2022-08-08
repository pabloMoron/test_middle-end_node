import * as express from "express"
import { Source } from "../middlewares/passport"
import * as error from "../server/error"

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

export async function findItemDescription (req: IItemDescriptionRequest, res: express.Response) {
    try{
        const itemDesc = await findItemDescriptionById(req.user, req.params.id)
        res.json(itemDesc)
    }
    catch(exception){
        error.handle(res, exception)
    }
}

async function findItemDescriptionById(source: Source, id: string): Promise<IItemDescriptionResponse>{
    return new Promise<IItemDescriptionResponse>((resolve, reject)=>{
        validateDescriptionRequest(id)
        .then(source => {
            console.log(source)
            resolve({
                author: {
                    name: "Pablo",
                    lastname: "Moron"
                },
                item:{
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

            })
        })
        .catch(exception => reject(exception))
    })
}

function validateDescriptionRequest(id: string): Promise<string> {
    const result: error.ValidationErrorMessage = {
        messages: []
    }
    const regex = new RegExp("[^A-Za-z0-9]")
    
    if(!id || id.length<=0) {
        result.messages.push({
            path: "id",
            message: "id cannot be null"
        })
    }

    if( regex.test(id)) {
        result.messages.push({
            path: "id",
            message: "numbers and letters only"
        })
    }

    if(result.messages.length>0){
        return Promise.reject(result)
    }
    return Promise.resolve(id)
}
