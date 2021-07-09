import { Document, Schema, model } from "mongoose";
import slugify from "slugify";
import { IMediaDocument } from "./media.model";
import { IUserDocument } from "./user.model";
import { HashCountSchema, IHashCountDocument } from "./hashcount.model";

export interface IPostMetricsDocument extends Document {
    views: {
        unverified: IHashCountDocument
        verified: IHashCountDocument
    }
}

export interface IPostDocument extends Document {
    cover: IMediaDocument
    title: string
    author: IUserDocument
    slug: string
    excerpt?: string
    content: object
    censored: boolean
    topics: string[]
    hashtags: string[]
    contributors: IUserDocument[]
    sources: string[]
    narration?: {
        male: String
        female: String
    } | null
    draft: boolean
    metrics: IPostMetricsDocument
}

export const PostMetricsSchema = new Schema<IPostMetricsDocument>({
    views: {
        unverified: {
            type: HashCountSchema,
            default: {},
            required: true
        },
        verified: {
            type: HashCountSchema,
            default: {},
            required: true
        }
    }
}, { _id: false, minimize: false, versionKey: false })

export const PostSchema = new Schema<IPostDocument>({
    cover: {
        type: Schema.Types.ObjectId,
        ref: "Media",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    slug: {
        type: String,
        default: function (this: IPostDocument) {
            return slugify(this.title)
        }
    },
    excerpt: {
        type: String
    },
    content: {
        type: Schema.Types.Mixed,
        required: true
    },
    censored: {
        type: Boolean
    },
    topics: {
        type: [String],
        default: []
    },
    hashtags: {
        type: [String],
        default: []
    },
    contributors: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        default: []
    },
    sources: {
        type: [String],
        default: []
    },
    narration: {
        type: {
            male: String,
            female: String
        }
    },
    draft: {
        type: Boolean,
        default: true,
        required: true
    },
    metrics: {
        type: PostMetricsSchema,
        default: {},
        required: true
    }
}, { timestamps: true })

PostSchema.index({ title: "text", excerpt: "text", hashtags: "text", topics: "text" })

export const PostModel = model<IPostDocument>("Post", PostSchema)
