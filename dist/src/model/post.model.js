"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = exports.PostSchema = exports.PostMetricsSchema = void 0;
var mongoose_1 = require("mongoose");
var slugify_1 = __importDefault(require("slugify"));
var hashcount_model_1 = require("./hashcount.model");
exports.PostMetricsSchema = new mongoose_1.Schema({
    views: {
        unverified: {
            type: hashcount_model_1.HashCountSchema,
            default: {},
            required: true
        },
        verified: {
            type: hashcount_model_1.HashCountSchema,
            default: {},
            required: true
        }
    }
}, { _id: false, minimize: false, versionKey: false });
exports.PostSchema = new mongoose_1.Schema({
    cover: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Media",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    slug: {
        type: String,
        default: function () {
            return slugify_1.default(this.title);
        }
    },
    excerpt: {
        type: String
    },
    content: {
        type: mongoose_1.Schema.Types.Mixed,
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
                type: mongoose_1.Schema.Types.ObjectId,
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
        type: exports.PostMetricsSchema,
        default: {},
        required: true
    }
}, { timestamps: true });
exports.PostSchema.index({ title: "text", excerpt: "text", hashtags: "text", topics: "text" });
exports.PostModel = mongoose_1.model("Post", exports.PostSchema);
