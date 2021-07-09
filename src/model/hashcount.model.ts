import { BloomFilter } from "bloomfilter";
import { Document, Schema } from "mongoose";

export interface IHashCountDocument extends Document {
    bloomBuckets: number[]
    count: number
}

export const HashCountSchema = new Schema<IHashCountDocument>({
    bloomBuckets: {
        type: [Number],
        default: function () {
            const bloom = new BloomFilter(32 * 256, 8)
            return [].slice.call(bloom.buckets)
        },
        required: true
    },
    count: {
        type: Number,
        default: 0,
        required: true
    }
}, { _id: false, minimize: false, versionKey: false })
