"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.UserSchema = exports.UserRole = void 0;
var mongoose_1 = require("mongoose");
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var gravatar_1 = __importDefault(require("gravatar"));
var UserRole;
(function (UserRole) {
    UserRole[UserRole["USER"] = 0] = "USER";
    UserRole[UserRole["MEMBER"] = 1] = "MEMBER";
    UserRole[UserRole["MODERATOR"] = 2] = "MODERATOR";
    UserRole[UserRole["ADMIN"] = 3] = "ADMIN";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
exports.UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){2,}[a-zA-Z0-9]$/.test(value);
            },
            message: function (props) { return props.value + " is not a valid username"; }
        }
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value);
            },
            message: function (props) { return props.value + " is not a valid email address"; }
        }
    },
    gravatar: {
        type: String
    },
    phone: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
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
        default: UserRole.USER
    },
    privacy: {
        emailPublic: {
            type: Boolean,
            default: true
        },
        phonePublic: {
            type: Boolean,
            default: false
        }
    }
});
exports.UserSchema.pre("save", function () {
    if (this.isNew || this.isModified("password")) {
        var salt = bcryptjs_1.default.genSaltSync(10);
        this.password = bcryptjs_1.default.hashSync(this.password, salt);
    }
    if (this.isNew || this.isModified("email")) {
        this.gravatar = gravatar_1.default.url(this.email);
    }
});
exports.UserModel = mongoose_1.model("User", exports.UserSchema);
