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
exports.ModeratorController = void 0;
var lodash_1 = __importDefault(require("lodash"));
var user_model_1 = require("../model/user.model");
var badge_service_1 = require("../service/badge.service");
var comment_service_1 = require("../service/comment.service");
var narration_service_1 = require("../service/narration.service");
var post_service_1 = require("../service/post.service");
var user_service_1 = require("../service/user.service");
var member_controller_1 = require("./member.controller");
var html_to_text_1 = require("html-to-text");
var uniqid_1 = __importDefault(require("uniqid"));
var media_service_1 = require("../service/media.service");
var prosemirror_schema_basic_1 = require("prosemirror-schema-basic");
var prosemirror_model_1 = require("prosemirror-model");
function extractText(content) {
    var root = prosemirror_model_1.Node.fromJSON(prosemirror_schema_basic_1.schema, content);
    return root.textContent;
}
exports.ModeratorController = lodash_1.default.merge(lodash_1.default.cloneDeep(member_controller_1.MemberController), {
    assignBadge: {
        post: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, username, badgeId, badge, user;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.MODERATOR)) return [3 /*break*/, 5];
                            _a = req.body, username = _a.username, badgeId = _a.badgeId;
                            return [4 /*yield*/, badge_service_1.BadgeService.findOne({ _id: badgeId })];
                        case 1:
                            badge = _b.sent();
                            if (!badge) return [3 /*break*/, 3];
                            return [4 /*yield*/, user_service_1.UserService.updateOne({ username: username }, { $addToSet: { badges: badge.id } })];
                        case 2:
                            user = _b.sent();
                            if (user)
                                res.status(200).send({ user: user });
                            else
                                res.status(404).send();
                            return [3 /*break*/, 4];
                        case 3:
                            res.status(404).send();
                            _b.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            res.status(401).send();
                            _b.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        }
    },
    post: {
        delete: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var postId, post;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username)) return [3 /*break*/, 13];
                            postId = req.params.postId;
                            if (!postId) return [3 /*break*/, 11];
                            return [4 /*yield*/, post_service_1.PostService.findOne({ _id: postId })];
                        case 1:
                            post = _a.sent();
                            if (!post) return [3 /*break*/, 9];
                            if (!(req.context.role >= user_model_1.UserRole.MODERATOR)) return [3 /*break*/, 6];
                            if (!post.narration) return [3 /*break*/, 4];
                            return [4 /*yield*/, media_service_1.MediaService.delete(post.narration.male)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, media_service_1.MediaService.delete(post.narration.female)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [4 /*yield*/, post_service_1.PostService.updateOne({ _id: postId }, { content: {}, censored: true, narration: null })];
                        case 5:
                            post = _a.sent();
                            res.status(200).send({ post: post });
                            return [3 /*break*/, 8];
                        case 6: return [4 /*yield*/, member_controller_1.MemberController.post.delete(req, res, next)];
                        case 7:
                            _a.sent();
                            _a.label = 8;
                        case 8: return [3 /*break*/, 10];
                        case 9:
                            res.status(404).send();
                            _a.label = 10;
                        case 10: return [3 /*break*/, 12];
                        case 11:
                            res.status(400).send();
                            _a.label = 12;
                        case 12: return [3 /*break*/, 14];
                        case 13:
                            res.status(401).send();
                            _a.label = 14;
                        case 14: return [2 /*return*/];
                    }
                });
            });
        }
    },
    comment: {
        delete: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var commentId, comment;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username)) return [3 /*break*/, 10];
                            commentId = req.params.commentId;
                            if (!commentId) return [3 /*break*/, 8];
                            return [4 /*yield*/, comment_service_1.CommentService.findOne({ _id: commentId })];
                        case 1:
                            comment = _a.sent();
                            if (!comment) return [3 /*break*/, 6];
                            if (!(req.context.role >= user_model_1.UserRole.MODERATOR)) return [3 /*break*/, 3];
                            return [4 /*yield*/, comment_service_1.CommentService.updateOne({ _id: commentId }, { content: {}, censored: true })];
                        case 2:
                            comment = _a.sent();
                            res.status(200).send({ comment: comment });
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, member_controller_1.MemberController.comment.delete(req, res, next)];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            res.status(404).send();
                            _a.label = 7;
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            res.status(400).send();
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
    narration: {
        get: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var postId, post, rawTextContent, text, _a, male, female, key;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.MODERATOR)) return [3 /*break*/, 10];
                            postId = req.params.postId;
                            if (!postId) return [3 /*break*/, 8];
                            return [4 /*yield*/, post_service_1.PostService.findOne({ _id: postId })];
                        case 1:
                            post = _b.sent();
                            if (!(post && post.author.username === req.context.username)) return [3 /*break*/, 6];
                            if (post.narration)
                                throw Error("narration already created");
                            rawTextContent = extractText(post.content);
                            text = html_to_text_1.convert(rawTextContent, {
                                selectors: [{ selector: 'a', options: { ignoreHref: true } }]
                            });
                            return [4 /*yield*/, narration_service_1.NarrationService.generate(text)];
                        case 2:
                            _a = _b.sent(), male = _a.male, female = _a.female;
                            key = uniqid_1.default();
                            return [4 /*yield*/, media_service_1.MediaService.upload(key + "_male", male, "audio/mpeg")];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, media_service_1.MediaService.upload(key + "_female", female, "audio/mpeg")];
                        case 4:
                            _b.sent();
                            return [4 /*yield*/, post_service_1.PostService.updateOne({ _id: postId }, {
                                    narration: {
                                        male: key + "_male",
                                        female: key + "_female"
                                    }
                                })];
                        case 5:
                            post = _b.sent();
                            res.status(200).send({ post: post });
                            return [3 /*break*/, 7];
                        case 6:
                            res.status(404).send();
                            _b.label = 7;
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            res.status(404).send();
                            _b.label = 9;
                        case 9: return [3 /*break*/, 11];
                        case 10:
                            res.status(401).send();
                            _b.label = 11;
                        case 11: return [2 /*return*/];
                    }
                });
            });
        }
    }
});
