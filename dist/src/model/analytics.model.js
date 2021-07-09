"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsModel = exports.AnalyticsSchema = void 0;
var bloomfilter_1 = require("bloomfilter");
var mongoose_1 = require("mongoose");
exports.AnalyticsSchema = new mongoose_1.Schema({
    visits: {
        bloomBuckets: {
            type: [Number],
            default: function () {
                var bloom = new bloomfilter_1.BloomFilter(32 * 256, 8);
                return [].slice.call(bloom.buckets);
            },
            required: true
        },
        devices: {
            type: mongoose_1.Schema.Types.Mixed,
            default: {}
        }
    },
    year: {
        type: Number,
        default: function () { return new Date().getFullYear(); }
    },
    month: {
        type: Number,
        default: function () { return new Date().getMonth(); }
    }
});
exports.AnalyticsModel = mongoose_1.model("Analytics", exports.AnalyticsSchema);
