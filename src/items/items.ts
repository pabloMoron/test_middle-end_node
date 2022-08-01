import { Collection, Document, model, Schema } from "mongoose"

export interface IItem{
    name: string
}

const ItemSchema = new Schema({
    name:{
        type: String,
        trim: true,
        required: [true, "Name is required"]
    }
})