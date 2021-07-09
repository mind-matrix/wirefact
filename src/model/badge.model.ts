import { Document, Schema, model } from "mongoose";
import { IMediaDocument } from "./media.model";

export interface IBadgeDocument extends Document {
    name: string
    image: IMediaDocument
    description: string
}

export const BadgeSchema = new Schema<IBadgeDocument>({
    name: {
        type: String,
        required: true
    },
    image: {
        type: Schema.Types.ObjectId,
        ref: "Media",
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

export const BadgeModel = model<IBadgeDocument>("Badge", BadgeSchema)
