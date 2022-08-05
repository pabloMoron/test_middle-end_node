import * as express from "express"

export interface IItemDescriptionRequest extends express.Request {
    id: String
}

export interface IItemDescriptionResponse{

}

export async function findItemDescriptionById (req: IItemDescriptionRequest, res: express.Response) {
    // console.log(req.id)
    res.json({a:"OK"})
}

function validateRequest(req: IItemDescriptionRequest): Promise<IItemDescriptionRequest> {
    const regex = /[A-Za-z0-9]/;
    return Promise.reject("")
    return Promise.resolve(req)
}
