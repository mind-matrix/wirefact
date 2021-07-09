"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = exports.CommentSchema = void 0;
var mongoose_1 = require("mongoose");
exports.CommentSchema = new mongoose_1.Schema({
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    postId: {
        type: String
    },
    content: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true
    },
    censored: {
        type: Boolean
    },
    mentions: {
        type: [{
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "User"
            }],
        default: []
    },
    sentiment: {
        type: Number,
        default: 0
    }
});
exports.CommentModel = mongoose_1.model("Comment", exports.CommentSchema);
