import { Document, Schema, model } from "mongoose"
import { IUserDocument } from "./user.model"
// @ts-ignore
import sentiment from "wink-sentiment"

function _extractText(content: any): string {
    if (!content || !Array.isArray(content)) return ""
    let text = []
    for (let item of content) {
        if (item.type === "text" && item.text) {
            text.push(item.text)
        } else if (item.content) {
            text.push(_extractText(item.content))
        }
    }
    return text.join(" ")
}

function extractText(doc: any) {
    return _extractText(doc.content)
}

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
}, { timestamps: true })

CommentSchema.pre("save", function () {
    if (this.isNew || this.isModified("content")) {
        let text = extractText(this.content)
        let data = sentiment(text)
        this.sentiment = data.normalizedScore
    }
})

export const CommentModel = model<ICommentDocument>("Comment", CommentSchema)
