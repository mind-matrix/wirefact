"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetModel = exports.PasswordResetSchema = void 0;
var uniqid_1 = __importDefault(require("uniqid"));
var mongoose_1 = require("mongoose");
exports.PasswordResetSchema = new mongoose_1.Schema({
    code: {
        type: String,
        required: true,
        default: function () { return uniqid_1.default(); }
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    }
});
exports.PasswordResetModel = mongoose_1.model("PasswordReset", exports.PasswordResetSchema);
