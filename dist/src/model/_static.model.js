"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticModel = exports.StaticSchema = void 0;
var mongoose_1 = require("mongoose");
exports.StaticSchema = new mongoose_1.Schema({
    config: {
        type: mongoose_1.Schema.Types.Mixed,
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
});
exports.StaticModel = mongoose_1.model("Static", exports.StaticSchema);
