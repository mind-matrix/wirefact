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
exports.BadgeService = void 0;
var badge_model_1 = require("../model/badge.model");
var lodash_1 = __importDefault(require("lodash"));
var user_model_1 = require("../model/user.model");
var media_service_1 = require("./media.service");
var BadgeService = /** @class */ (function () {
    function BadgeService() {
    }
    BadgeService.sanitize = function (badge) {
        return __awaiter(this, void 0, void 0, function () {
            var fields, total, active, _a;
            var _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        fields = ["id", "name", "image", "description"];
                        if (!badge)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, user_model_1.UserModel.estimatedDocumentCount()];
                    case 1:
                        total = _c.sent();
                        if (Array.isArray(badge))
                            return [2 /*return*/, Promise.all(badge.map(function (b) { return __awaiter(_this, void 0, void 0, function () {
                                    var active, _a;
                                    var _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0: return [4 /*yield*/, user_model_1.UserModel.count({ badges: b.id })];
                                            case 1:
                                                active = _c.sent();
                                                _a = [__assign({}, lodash_1.default.pick(b.toJSON({ virtuals: true }), fields))];
                                                _b = {};
                                                return [4 /*yield*/, media_service_1.MediaService.sanitize(b.image)];
                                            case 2: return [2 /*return*/, __assign.apply(void 0, _a.concat([(_b.media = _c.sent(), _b.popularity = (active / total).toFixed(2), _b)]))];
                                        }
                                    });
                                }); }))];
                        return [4 /*yield*/, user_model_1.UserModel.count({ badges: badge.id })];
                    case 2:
                        active = _c.sent();
                        _a = [__assign({}, lodash_1.default.pick(badge.toJSON({ virtuals: true }), fields))];
                        _b = {};
                        return [4 /*yield*/, media_service_1.MediaService.sanitize(badge.image)];
                    case 3: return [2 /*return*/, __assign.apply(void 0, _a.concat([(_b.media = _c.sent(), _b.popularity = (active / total).toFixed(2), _b)]))];
                }
            });
        });
    };
    BadgeService.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var badge, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        badge = new badge_model_1.BadgeModel(data);
                        err = badge.validateSync();
                        if (err)
                            throw Error("invalid badge document");
                        return [4 /*yield*/, badge.save()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, badge.populate("media").execPopulate()];
                    case 2:
                        badge = _a.sent();
                        return [4 /*yield*/, this.sanitize(badge)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    BadgeService.findOne = function (filters, options) {
        if (filters === void 0) { filters = {}; }
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var badge;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, badge_model_1.BadgeModel.findOne(filters, null, options).populate("image")];
                    case 1:
                        badge = _a.sent();
                        if (!badge)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, this.sanitize(badge)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    BadgeService.find = function (filters, options) {
        if (filters === void 0) { filters = {}; }
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var badge;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, badge_model_1.BadgeModel.find(filters, null, options).populate("image")];
                    case 1:
                        badge = _a.sent();
                        return [4 /*yield*/, this.sanitize(badge)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    BadgeService.count = function (filters) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, badge_model_1.BadgeModel.count(filters)];
                    case 1:
                        count = _a.sent();
                        return [2 /*return*/, count];
                }
            });
        });
    };
    BadgeService.updateOne = function (filters, updates) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var badge;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, badge_model_1.BadgeModel.findOneAndUpdate(filters, updates, { new: true }).populate("image")];
                    case 1:
                        badge = _a.sent();
                        if (!badge)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, this.sanitize(badge)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return BadgeService;
}());
exports.BadgeService = BadgeService;
