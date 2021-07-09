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
exports.PostService = void 0;
var bloomfilter_1 = require("bloomfilter");
var lodash_1 = __importDefault(require("lodash"));
var post_model_1 = require("../model/post.model");
var media_service_1 = require("./media.service");
var user_service_1 = require("./user.service");
var PostService = /** @class */ (function () {
    function PostService() {
    }
    PostService.sanitize = function (post) {
        return __awaiter(this, void 0, void 0, function () {
            var fields, mediaFields, _a, _b, _c;
            var _d;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        fields = ["id", "cover", "title", "author", "slug", "excerpt", "content", "topics", "hashtags", "contributors", "sources", "narration", "draft", "metrics.views.verified.count", "metrics.views.unverified.count", "createdAt", "updatedAt"];
                        mediaFields = ["id", "key", "filename", "filetype", "filesize", "metadata"];
                        if (!post)
                            return [2 /*return*/, null];
                        if (Array.isArray(post))
                            return [2 /*return*/, Promise.all(post.map(function (p) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a, _b, _c;
                                    var _d;
                                    return __generator(this, function (_e) {
                                        switch (_e.label) {
                                            case 0:
                                                _a = [__assign({}, lodash_1.default.pick(p.toJSON({ virtuals: true }), fields))];
                                                _d = {};
                                                _c = (_b = lodash_1.default).pick;
                                                return [4 /*yield*/, media_service_1.MediaService.sanitize(p.cover)];
                                            case 1:
                                                _d.cover = _c.apply(_b, [_e.sent(), mediaFields]);
                                                return [4 /*yield*/, user_service_1.UserService.sanitize(p.author)];
                                            case 2:
                                                _d.author = _e.sent();
                                                return [4 /*yield*/, user_service_1.UserService.sanitize(p.contributors)];
                                            case 3: return [2 /*return*/, __assign.apply(void 0, _a.concat([(_d.contributors = _e.sent(), _d)]))];
                                        }
                                    });
                                }); }))];
                        _a = [__assign({}, lodash_1.default.pick(post.toJSON({ virtuals: true }), fields))];
                        _d = {};
                        _c = (_b = lodash_1.default).pick;
                        return [4 /*yield*/, media_service_1.MediaService.sanitize(post.cover)];
                    case 1:
                        _d.cover = _c.apply(_b, [_e.sent(), mediaFields]);
                        return [4 /*yield*/, user_service_1.UserService.sanitize(post.author)];
                    case 2:
                        _d.author = _e.sent();
                        return [4 /*yield*/, user_service_1.UserService.sanitize(post.contributors)];
                    case 3: return [2 /*return*/, __assign.apply(void 0, _a.concat([(_d.contributors = _e.sent(), _d)]))];
                }
            });
        });
    };
    PostService.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var post, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        post = new post_model_1.PostModel(data);
                        err = post.validateSync();
                        if (err)
                            throw Error("invalid post document");
                        return [4 /*yield*/, post.save()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, post.populate("cover").populate("author").populate("contributors").execPopulate()];
                    case 2:
                        post = _a.sent();
                        return [4 /*yield*/, this.sanitize(post)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PostService.findOne = function (filters, options, projection) {
        if (filters === void 0) { filters = {}; }
        if (options === void 0) { options = {}; }
        if (projection === void 0) { projection = null; }
        return __awaiter(this, void 0, void 0, function () {
            var post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, post_model_1.PostModel.findOne(filters, projection, options).populate("cover").populate("author").populate("contributors")];
                    case 1:
                        post = _a.sent();
                        if (!post)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, this.sanitize(post)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PostService.find = function (filters, options, projection) {
        if (filters === void 0) { filters = {}; }
        if (options === void 0) { options = {}; }
        if (projection === void 0) { projection = null; }
        return __awaiter(this, void 0, void 0, function () {
            var post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, post_model_1.PostModel.find(filters, projection, options).populate("cover").populate("author").populate("contributors")];
                    case 1:
                        post = _a.sent();
                        return [4 /*yield*/, this.sanitize(post)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PostService.count = function (filters) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, post_model_1.PostModel.count(filters)];
                    case 1:
                        count = _a.sent();
                        return [2 /*return*/, count];
                }
            });
        });
    };
    PostService.updateOne = function (filters, updates) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, post_model_1.PostModel.findOneAndUpdate(filters, updates, { new: true }).populate("cover").populate("author").populate("contributors")];
                    case 1:
                        post = _a.sent();
                        if (!post)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, this.sanitize(post)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PostService.deleteOne = function (filters) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, post_model_1.PostModel.findOne(filters).populate("cover").populate("author").populate("contributors")];
                    case 1:
                        post = _a.sent();
                        if (!post)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, post.remove()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.sanitize(post)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PostService.addView = function (filters, identification) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var post, bloom, bloom;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, post_model_1.PostModel.findOne(filters)];
                    case 1:
                        post = _a.sent();
                        if (!post)
                            return [2 /*return*/, null];
                        if (identification.ip) {
                            bloom = new bloomfilter_1.BloomFilter(post.metrics.views.unverified.bloomBuckets, 8);
                            if (!bloom.test(identification.ip)) {
                                bloom.add(identification.ip);
                                post.metrics.views.unverified.bloomBuckets = [].slice.call(bloom.buckets);
                                post.metrics.views.unverified.count += 1;
                            }
                        }
                        else if (identification.username) {
                            bloom = new bloomfilter_1.BloomFilter(post.metrics.views.verified.bloomBuckets, 8);
                            if (!bloom.test(identification.username)) {
                                bloom.add(identification.username);
                                post.metrics.views.verified.bloomBuckets = [].slice.call(bloom.buckets);
                                post.metrics.views.verified.count += 1;
                            }
                        }
                        return [4 /*yield*/, post.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, lodash_1.default.pick(post.metrics.views, ["verified.count", "unverified.count"])];
                }
            });
        });
    };
    return PostService;
}());
exports.PostService = PostService;
