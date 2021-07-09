"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaModel = exports.MediaSchema = void 0;
var mongoose_1 = require("mongoose");
exports.MediaSchema = new mongoose_1.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    filesize: {
        type: Number,
        required: true
    },
    filename: {
        type: String,
        required: true,
        index: true
    },
    filetype: {
        type: String,
        required: true
    },
    metadata: {
        type: mongoose_1.Schema.Types.Mixed
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});
exports.MediaModel = mongoose_1.model("Media", exports.MediaSchema);
