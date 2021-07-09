"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationModel = exports.InvitationSchema = void 0;
var mongoose_1 = require("mongoose");
var user_model_1 = require("./user.model");
var uniqid_1 = __importDefault(require("uniqid"));
exports.InvitationSchema = new mongoose_1.Schema({
    code: {
        type: String,
        required: true,
        default: function () { return uniqid_1.default(); },
        unique: true,
        index: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    phone: {
        type: String,
        unique: true
    },
    badges: {
        type: [{
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Badge"
            }],
        default: []
    },
    role: {
        type: Number,
        default: user_model_1.UserRole.USER
    }
});
exports.InvitationModel = mongoose_1.model("Invitation", exports.InvitationSchema);
