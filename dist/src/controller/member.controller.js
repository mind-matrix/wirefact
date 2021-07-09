"use strict";
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
exports.MemberController = void 0;
var lodash_1 = __importDefault(require("lodash"));
var user_model_1 = require("../model/user.model");
var badge_service_1 = require("../service/badge.service");
var media_service_1 = require("../service/media.service");
var post_service_1 = require("../service/post.service");
var user_service_1 = require("../service/user.service");
var user_controller_1 = require("./user.controller");
exports.MemberController = lodash_1.default.merge(lodash_1.default.cloneDeep(user_controller_1.UserController), {
    badge: {
        get: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var badgeId, badge;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.MEMBER)) return [3 /*break*/, 4];
                            badgeId = req.params.badgeId;
                            if (!badgeId) return [3 /*break*/, 2];
                            return [4 /*yield*/, badge_service_1.BadgeService.findOne({ _id: badgeId })];
                        case 1:
                            badge = _a.sent();
                            if (!badge)
                                res.status(404).send();
                            else
                                res.status(200).send({ badge: badge });
                            return [3 /*break*/, 3];
                        case 2:
                            res.status(400).send();
                            _a.label = 3;
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            res.status(401).send();
                            _a.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
    },
    badges: {
        get: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var badges;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.MEMBER)) return [3 /*break*/, 2];
                            return [4 /*yield*/, badge_service_1.BadgeService.find({})];
                        case 1:
                            badges = _a.sent();
                            res.status(200).send({ badges: badges });
                            return [3 /*break*/, 3];
                        case 2:
                            res.status(401).send();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    },
    draft: {
        get: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var postId, author, draft;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.MEMBER)) return [3 /*break*/, 5];
                            postId = req.params.postId;
                            return [4 /*yield*/, user_service_1.UserService.findOne({ username: req.context.username })];
                        case 1:
                            author = _a.sent();
                            if (!(author && postId)) return [3 /*break*/, 3];
                            return [4 /*yield*/, post_service_1.PostService.findOne({ _id: postId, draft: true, author: author.id })];
                        case 2:
                            draft = _a.sent();
                            if (draft)
                                res.status(200).send({ draft: draft });
                            else
                                res.status(404).send();
                            return [3 /*break*/, 4];
                        case 3:
                            res.status(404).send();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            res.status(401).send();
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        }
    },
    drafts: {
        get: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, skip, limit, projection, author, drafts;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            filters = req.query;
                            skip = filters.skip ? parseInt(filters.skip) : 0;
                            limit = filters.limit ? Math.min(15, parseInt(filters.limit)) : 15;
                            projection = filters.content ? null : '-content';
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.MEMBER)) return [3 /*break*/, 5];
                            return [4 /*yield*/, user_service_1.UserService.findOne({ username: req.context.username })];
                        case 1:
                            author = _a.sent();
                            if (!author) return [3 /*break*/, 3];
                            return [4 /*yield*/, post_service_1.PostService.find({ draft: true, author: author.id }, { skip: skip, limit: limit, sort: '-createdAt' }, projection)];
                        case 2:
                            drafts = _a.sent();
                            res.status(200).send({ drafts: drafts });
                            return [3 /*break*/, 4];
                        case 3:
                            res.status(404).send();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            res.status(401).send();
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        }
    },
    countDrafts: {
        get: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var user, count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.MEMBER)) return [3 /*break*/, 5];
                            return [4 /*yield*/, user_service_1.UserService.findOne({ username: req.context.username })];
                        case 1:
                            user = _a.sent();
                            if (!user) return [3 /*break*/, 3];
                            return [4 /*yield*/, post_service_1.PostService.count({ author: user.id, draft: true })];
                        case 2:
                            count = _a.sent();
                            res.status(200).send({ count: count });
                            return [3 /*break*/, 4];
                        case 3:
                            res.status(404).send();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            res.status(401).send();
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        }
    },
    post: {
        post: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var author, data, post;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.MEMBER)) return [3 /*break*/, 5];
                            return [4 /*yield*/, user_service_1.UserService.findOne({ username: req.context.username })];
                        case 1:
                            author = _a.sent();
                            if (!author) return [3 /*break*/, 3];
                            data = lodash_1.default.pick(req.body, ["cover", "title", "slug", "excerpt", "content", "topics", "hashtags", "sources", "draft"]);
                            data.author = author.id;
                            return [4 /*yield*/, post_service_1.PostService.create(data)];
                        case 2:
                            post = _a.sent();
                            res.status(200).send({ post: post });
                            return [3 /*break*/, 4];
                        case 3:
                            res.status(404).send();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            res.status(401).send();
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        },
        put: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var author, postId, data, post;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.MEMBER)) return [3 /*break*/, 5];
                            return [4 /*yield*/, user_service_1.UserService.findOne({ username: req.context.username })];
                        case 1:
                            author = _a.sent();
                            if (!author) return [3 /*break*/, 3];
                            postId = req.params.postId;
                            data = lodash_1.default.pick(req.body, ["cover", "title", "slug", "excerpt", "content", "topics", "hashtags", "sources", "draft"]);
                            return [4 /*yield*/, post_service_1.PostService.updateOne({ _id: postId, author: author.id }, data)];
                        case 2:
                            post = _a.sent();
                            if (!post)
                                res.status(404).send();
                            else
                                res.status(200).send({ post: post });
                            return [3 /*break*/, 4];
                        case 3:
                            res.status(500).send();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            res.status(401).send();
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        },
        delete: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var author, postId, post;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.MEMBER)) return [3 /*break*/, 10];
                            return [4 /*yield*/, user_service_1.UserService.findOne({ username: req.context.username })];
                        case 1:
                            author = _a.sent();
                            if (!author) return [3 /*break*/, 8];
                            postId = req.params.postId;
                            return [4 /*yield*/, post_service_1.PostService.deleteOne({ _id: postId, author: author.id })];
                        case 2:
                            post = _a.sent();
                            if (!post) return [3 /*break*/, 6];
                            if (!post.narration) return [3 /*break*/, 5];
                            return [4 /*yield*/, media_service_1.MediaService.delete(post.narration.male)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, media_service_1.MediaService.delete(post.narration.female)];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5:
                            res.status(200).send({ post: post });
                            return [3 /*break*/, 7];
                        case 6:
                            res.status(404).send();
                            _a.label = 7;
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            res.status(500).send();
                            _a.label = 9;
                        case 9: return [3 /*break*/, 11];
                        case 10:
                            res.status(401).send();
                            _a.label = 11;
                        case 11: return [2 /*return*/];
                    }
                });
            });
        }
    },
    publishedPost: {
        get: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var postId, author, post;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.MEMBER)) return [3 /*break*/, 5];
                            postId = req.params.postId;
                            return [4 /*yield*/, user_service_1.UserService.findOne({ username: req.context.username })];
                        case 1:
                            author = _a.sent();
                            if (!(author && postId)) return [3 /*break*/, 3];
                            return [4 /*yield*/, post_service_1.PostService.findOne({ _id: postId, draft: false, author: author.id })];
                        case 2:
                            post = _a.sent();
                            if (post)
                                res.status(200).send({ post: post });
                            else
                                res.status(404).send();
                            return [3 /*break*/, 4];
                        case 3:
                            res.status(404).send();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            res.status(401).send();
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        }
    },
    publishedPosts: {
        get: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, skip, limit, projection, author, posts;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            filters = req.query;
                            skip = filters.skip ? parseInt(filters.skip) : 0;
                            limit = filters.limit ? Math.min(15, parseInt(filters.limit)) : 15;
                            projection = filters.content ? null : '-content';
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.MEMBER)) return [3 /*break*/, 5];
                            return [4 /*yield*/, user_service_1.UserService.findOne({ username: req.context.username })];
                        case 1:
                            author = _a.sent();
                            if (!author) return [3 /*break*/, 3];
                            return [4 /*yield*/, post_service_1.PostService.find({ draft: false, author: author.id }, { skip: skip, limit: limit, sort: '-createdAt' }, projection)];
                        case 2:
                            posts = _a.sent();
                            res.status(200).send({ posts: posts });
                            return [3 /*break*/, 4];
                        case 3:
                            res.status(404).send();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            res.status(401).send();
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        }
    },
    countPublishedPosts: {
        get: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var user, count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.MEMBER)) return [3 /*break*/, 5];
                            return [4 /*yield*/, user_service_1.UserService.findOne({ username: req.context.username })];
                        case 1:
                            user = _a.sent();
                            if (!user) return [3 /*break*/, 3];
                            return [4 /*yield*/, post_service_1.PostService.count({ author: user.id, draft: false })];
                        case 2:
                            count = _a.sent();
                            res.status(200).send({ count: count });
                            return [3 /*break*/, 4];
                        case 3:
                            res.status(404).send();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            res.status(401).send();
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        }
    },
    signMedia: {
        post: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var request, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.MEMBER)) return [3 /*break*/, 2];
                            request = lodash_1.default.pick(req.body, ["filename", "filetype"]);
                            return [4 /*yield*/, media_service_1.MediaService.signRequest(request)];
                        case 1:
                            response = _a.sent();
                            res.status(200).send(response);
                            return [3 /*break*/, 3];
                        case 2:
                            res.status(401).send();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    },
    media: {
        post: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var owner, data, usage, media;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.MEMBER)) return [3 /*break*/, 8];
                            return [4 /*yield*/, user_service_1.UserService.findOne({ username: req.context.username })];
                        case 1:
                            owner = _a.sent();
                            if (!owner) return [3 /*break*/, 6];
                            data = lodash_1.default.pick(req.body, ["key", "filesize", "filename", "filetype", "metadata"]);
                            data.owner = owner.id;
                            return [4 /*yield*/, media_service_1.MediaService.usage({ owner: owner.id })];
                        case 2:
                            usage = _a.sent();
                            if (!(usage.remaining < data.filesize)) return [3 /*break*/, 3];
                            res.status(403).send();
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, media_service_1.MediaService.create(data)];
                        case 4:
                            media = _a.sent();
                            res.status(200).send({ media: media });
                            _a.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            res.status(404).send();
                            _a.label = 7;
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            res.status(401).send();
                            _a.label = 9;
                        case 9: return [2 /*return*/];
                    }
                });
            });
        },
        put: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var mediaId, data, owner, media;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.MEMBER)) return [3 /*break*/, 5];
                            mediaId = req.params.mediaId;
                            data = lodash_1.default.pick(req.body, ["filename", "metadata"]);
                            return [4 /*yield*/, media_service_1.MediaService.findOne({ username: req.context.username })];
                        case 1:
                            owner = _a.sent();
                            if (!owner) return [3 /*break*/, 3];
                            return [4 /*yield*/, media_service_1.MediaService.updateOne({ _id: mediaId, owner: owner.id }, data)];
                        case 2:
                            media = _a.sent();
                            if (!media)
                                res.status(404).send();
                            else
                                res.status(200).send({ media: media });
                            return [3 /*break*/, 4];
                        case 3:
                            res.status(404).send();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            res.status(401).send();
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        },
        delete: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var mediaId, owner, media;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.MEMBER)) return [3 /*break*/, 8];
                            mediaId = req.params.mediaId;
                            return [4 /*yield*/, media_service_1.MediaService.findOne({ username: req.context.username })];
                        case 1:
                            owner = _a.sent();
                            if (!owner) return [3 /*break*/, 6];
                            return [4 /*yield*/, media_service_1.MediaService.deleteOne({ _id: mediaId, owner: owner.id })];
                        case 2:
                            media = _a.sent();
                            if (!!media) return [3 /*break*/, 3];
                            res.status(404).send();
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, media_service_1.MediaService.delete(media.key)];
                        case 4:
                            _a.sent();
                            res.status(200).send({ media: media });
                            _a.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            res.status(404).send();
                            _a.label = 7;
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            res.status(401).send();
                            _a.label = 9;
                        case 9: return [2 /*return*/];
                    }
                });
            });
        }
    },
    medias: {
        get: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, skip, limit, owner, medias;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            filters = req.query;
                            skip = filters.skip ? parseInt(filters.skip) : 0;
                            limit = filters.limit ? Math.min(15, parseInt(filters.limit)) : 15;
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.MEMBER)) return [3 /*break*/, 5];
                            return [4 /*yield*/, user_service_1.UserService.findOne({ username: req.context.username })];
                        case 1:
                            owner = _a.sent();
                            if (!owner) return [3 /*break*/, 3];
                            return [4 /*yield*/, media_service_1.MediaService.find({ owner: owner.id }, { skip: skip, limit: limit, sort: '-createdAt' })];
                        case 2:
                            medias = _a.sent();
                            res.status(200).send({ medias: medias });
                            return [3 /*break*/, 4];
                        case 3:
                            res.status(404).send();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            res.status(401).send();
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        }
    },
    countMedias: {
        get: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var owner, count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.MEMBER)) return [3 /*break*/, 5];
                            return [4 /*yield*/, user_service_1.UserService.findOne({ username: req.context.username })];
                        case 1:
                            owner = _a.sent();
                            if (!owner) return [3 /*break*/, 3];
                            return [4 /*yield*/, media_service_1.MediaService.count({ owner: owner.id })];
                        case 2:
                            count = _a.sent();
                            res.status(200).send({ count: count });
                            return [3 /*break*/, 4];
                        case 3:
                            res.status(404).send();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            res.status(401).send();
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        }
    },
    mediaUsage: {
        get: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var owner, usage;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.MEMBER)) return [3 /*break*/, 5];
                            return [4 /*yield*/, user_service_1.UserService.findOne({ username: req.context.username })];
                        case 1:
                            owner = _a.sent();
                            if (!owner) return [3 /*break*/, 3];
                            return [4 /*yield*/, media_service_1.MediaService.usage({ owner: owner.id })];
                        case 2:
                            usage = _a.sent();
                            res.status(200).send({ usage: usage });
                            return [3 /*break*/, 4];
                        case 3:
                            res.status(404).send();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            res.status(401).send();
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        }
    }
});
