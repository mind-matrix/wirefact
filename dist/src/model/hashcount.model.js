"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashCountSchema = void 0;
var bloomfilter_1 = require("bloomfilter");
var mongoose_1 = require("mongoose");
exports.HashCountSchema = new mongoose_1.Schema({
    bloomBuckets: {
        type: [Number],
        default: function () {
            var bloom = new bloomfilter_1.BloomFilter(32 * 256, 8);
            return [].slice.call(bloom.buckets);
        },
        required: true
    },
    count: {
        type: Number,
        default: 0,
        required: true
    }
}, { _id: false, minimize: false, versionKey: false });
