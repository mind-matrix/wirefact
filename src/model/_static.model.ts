import { Document, model, Schema } from "mongoose"

export interface IStaticDocument extends Document {
    config: { [k: string]: string | number }
    announcements: [{
        title: string
        tags: string[]
        content: string
        expiresAt: Date
    }]
    store: {
        narration: {
            charactersProcessed: number
            lastReset: Date
        }
    }
}

export const StaticSchema = new Schema<IStaticDocument>({
    config: {
        type: Schema.Types.Mixed,
        default: {}
    },
    announcements: {
        type: [{
            title: {
                type: String,
                required: true
            },
            tags: {
                type: [String],
                default: []
            },
            content: {
                type: String,
                required: true
            },
            expiresAt: {
                type: Date,
                required: true
            }
        }],
        default: []
    },
    store: {
        narration: {
            charactersProcessed: {
                type: Number,
                default: 0
            },
            lastReset: {
                type: Date,
                default: +new Date()
            }
        }
    }
})

export const StaticModel = model<IStaticDocument>("Static", StaticSchema)
