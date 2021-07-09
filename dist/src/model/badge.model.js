"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeModel = exports.BadgeSchema = void 0;
var mongoose_1 = require("mongoose");
exports.BadgeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Media",
        required: true
    },
    description: {
        type: String,
        required: true
    }
});
exports.BadgeModel = mongoose_1.model("Badge", exports.BadgeSchema);
