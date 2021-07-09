"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
var user_model_1 = require("../model/user.model");
var lodash_1 = __importDefault(require("lodash"));
var badge_service_1 = require("./badge.service");
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var password_reset_model_1 = require("../model/password-reset.model");
var uniqid_1 = __importDefault(require("uniqid"));
var UserService = /** @class */ (function () {
    function UserService() {
    }
    UserService.sanitize = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var fields, _a;
            var _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        fields = ["id", "username", "name", "email", "gravatar", "phone", "role", "privacy"];
                        if (!user)
                            return [2 /*return*/, null];
                        if (Array.isArray(user))
                            return [2 /*return*/, Promise.all(user.map(function (u) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a;
                                    var _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                _a = [__assign({}, lodash_1.default.pick(u.toJSON({ virtuals: true }), fields))];
                                                _b = {};
                                                return [4 /*yield*/, badge_service_1.BadgeService.sanitize(u.badges)];
                                            case 1: return [2 /*return*/, __assign.apply(void 0, _a.concat([(_b.badges = _c.sent(), _b)]))];
                                        }
                                    });
                                }); }))];
                        _a = [__assign({}, lodash_1.default.pick(user.toJSON({ virtuals: true }), fields))];
                        _b = {};
                        return [4 /*yield*/, badge_service_1.BadgeService.sanitize(user.badges)];
                    case 1: return [2 /*return*/, __assign.apply(void 0, _a.concat([(_b.badges = _c.sent(), _b)]))];
                }
            });
        });
    };
    UserService.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var user, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = new user_model_1.UserModel(data);
                        err = user.validateSync();
                        if (err)
                            throw Error("invalid user document");
                        return [4 /*yield*/, user.save()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.sanitize(user)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserService.validate = function (identifier, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isValid;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, user_model_1.UserModel.findOne({ $or: [{ username: identifier }, { email: identifier }] }, '+password')];
                    case 1:
                        user = _b.sent();
                        if (!user)
                            throw Error("user not found");
                        return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
                    case 2:
                        isValid = _b.sent();
                        _a = { isValid: isValid };
                        return [4 /*yield*/, this.sanitize(user)];
                    case 3: return [2 /*return*/, (_a.user = _b.sent(), _a)];
                }
            });
        });
    };
    UserService.createPasswordRequest = function (filters, options) {
        if (filters === void 0) { filters = {}; }
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var user, resetPassword;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_model_1.UserModel.findOne(filters, null, options)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new Error("user not found");
                        return [4 /*yield*/, password_reset_model_1.PasswordResetModel.findOneAndUpdate({
                                user: user.id
                            }, { code: uniqid_1.default() }, { new: true, upsert: true }).populate("user")];
                    case 2:
                        resetPassword = _a.sent();
                        return [4 /*yield*/, resetPassword.save()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, lodash_1.default.pick(resetPassword, ["code", "user"])];
                }
            });
        });
    };
    UserService.resetPassword = function (code, password) {
        return __awaiter(this, void 0, void 0, function () {
            var resetPassword, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, password_reset_model_1.PasswordResetModel.findOne({ code: code })];
                    case 1:
                        resetPassword = _a.sent();
                        if (!resetPassword)
                            throw new Error("no password reset requests found");
                        return [4 /*yield*/, user_model_1.UserModel.findOne({ _id: resetPassword.user })];
                    case 2:
                        user = _a.sent();
                        if (!user)
                            throw new Error("user not found");
                        user.password = password;
                        return [4 /*yield*/, user.save()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, resetPassword.remove()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.sanitize(user)];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserService.findOne = function (filters, options) {
        if (filters === void 0) { filters = {}; }
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_model_1.UserModel.findOne(filters, null, options).populate("badges")];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, this.sanitize(user)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserService.find = function (filters, options) {
        if (filters === void 0) { filters = {}; }
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_model_1.UserModel.find(filters, null, options).populate("badges")];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, this.sanitize(user)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserService.exists = function (filters) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var exists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_model_1.UserModel.exists(filters)];
                    case 1:
                        exists = _a.sent();
                        return [2 /*return*/, exists];
                }
            });
        });
    };
    UserService.count = function (filters) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_model_1.UserModel.count(filters)];
                    case 1:
                        count = _a.sent();
                        return [2 /*return*/, count];
                }
            });
        });
    };
    UserService.updateOne = function (filters, updates) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_model_1.UserModel.findOneAndUpdate(filters, updates, { new: true }).populate("badges")];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, this.sanitize(user)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return UserService;
}());
exports.UserService = UserService;
