import { Document, Schema, model } from "mongoose";
import { IUserDocument } from "./user.model";

export interface IMediaDocument extends Document {
    key: string
    filesize: number
    filename: string
    filetype: string
    metadata?: object
    owner: IUserDocument
}

export const MediaSchema = new Schema<IMediaDocument>({
    key: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    filesize: {
        type: Number,
        required: true
    },
    filename: {
        type: String,
        required: true,
        index: true
    },
    filetype: {
        type: String,
        required: true
    },
    metadata: {
        type: Schema.Types.Mixed
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })

export const MediaModel = model<IMediaDocument>("Media", MediaSchema)
