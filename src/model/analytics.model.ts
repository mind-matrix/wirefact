import { BloomFilter } from "bloomfilter";
import { Document, model, Schema } from "mongoose";

export interface IAnalyticsDocument extends Document {
    visits: {
        bloomBuckets: number[]
        devices: {
            [platform: string]: {
                [os: string]: {
                    unique: number,
                    returning: number
                }
            }
        }
    }
    year: number
    month: number
}

export const AnalyticsSchema = new Schema<IAnalyticsDocument>({
    visits: {
        bloomBuckets: {
            type: [Number],
            default: function () {
                const bloom = new BloomFilter(32 * 256, 8)
                return [].slice.call(bloom.buckets)
            },
            required: true
        },
        devices: {
            type: Schema.Types.Mixed,
            default: {}
        }
    },
    year: {
        type: Number,
        default: () => new Date().getFullYear()
    },
    month: {
        type: Number,
        default: () => new Date().getMonth()
    }
})

export const AnalyticsModel = model<IAnalyticsDocument>("Analytics", AnalyticsSchema)
