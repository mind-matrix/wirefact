import { Document, Schema, model } from "mongoose";
import { IUserDocument } from "./user.model";

export interface ICommentDocument extends Document {
    author: IUserDocument
    postId: string
    content: object
    censored: boolean
    mentions: IUserDocument[]
    sentiment: number
}

export const CommentSchema = new Schema<ICommentDocument>({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    postId: {
        type: String
    },
    content: {
        type: Schema.Types.Mixed,
        required: true
    },
    censored: {
        type: Boolean
    },
    mentions: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        default: []
    },
    sentiment: {
        type: Number,
        default: 0
    }
})

export const CommentModel = model<ICommentDocument>("Comment", CommentSchema)
