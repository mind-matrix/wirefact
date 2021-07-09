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
exports.AdminController = void 0;
var lodash_1 = __importDefault(require("lodash"));
var user_model_1 = require("../model/user.model");
var analytics_service_1 = require("../service/analytics.service");
var badge_service_1 = require("../service/badge.service");
var comment_service_1 = require("../service/comment.service");
var invitation_service_1 = require("../service/invitation.service");
var mail_service_1 = require("../service/mail.service");
var media_service_1 = require("../service/media.service");
var post_service_1 = require("../service/post.service");
var user_service_1 = require("../service/user.service");
var _static_service_1 = require("../service/_static.service");
var moderator_controller_1 = require("./moderator.controller");
exports.AdminController = lodash_1.default.merge(lodash_1.default.cloneDeep(moderator_controller_1.ModeratorController), {
    badge: {
        post: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var badge;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.ADMIN)) return [3 /*break*/, 2];
                            return [4 /*yield*/, badge_service_1.BadgeService.create(req.body)];
                        case 1:
                            badge = _a.sent();
                            res.status(200).send({ badge: badge });
                            return [3 /*break*/, 3];
                        case 2:
                            res.status(401).send();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        put: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var badgeId, data, badge;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.ADMIN)) return [3 /*break*/, 2];
                            badgeId = req.params.badgeId;
                            data = lodash_1.default.pick(req.body, ["name", "description"]);
                            return [4 /*yield*/, badge_service_1.BadgeService.updateOne({ _id: badgeId }, data)];
                        case 1:
                            badge = _a.sent();
                            if (!badge)
                                res.status(404).send();
                            else
                                res.status(200).send({ badge: badge });
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
    invitation: {
        post: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var data, invitation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.ADMIN)) return [3 /*break*/, 2];
                            data = req.body;
                            return [4 /*yield*/, invitation_service_1.InvitationService.create(data)];
                        case 1:
                            invitation = _a.sent();
                            mail_service_1.MailService.sendTemplated(invitation.email, "invitation", { name: invitation.name, invitationId: invitation.code });
                            res.status(200).send({ invitation: invitation });
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
    profile: {
        put: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var username, user, updates;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username)) return [3 /*break*/, 5];
                            username = req.params.username;
                            user = void 0;
                            if (!(username && req.context.role >= user_model_1.UserRole.ADMIN)) return [3 /*break*/, 2];
                            updates = lodash_1.default.pick(req.body, ["role"]);
                            return [4 /*yield*/, user_service_1.UserService.updateOne({ username: username }, updates)];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                res.status(400).send();
                            else
                                res.status(200).send({ user: user });
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, moderator_controller_1.ModeratorController.profile.put(req, res, next)];
                        case 3:
                            _a.sent();
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
    narration: {
        delete: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var postId, post;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.ADMIN)) return [3 /*break*/, 10];
                            postId = req.params.postId;
                            if (!postId) return [3 /*break*/, 8];
                            return [4 /*yield*/, post_service_1.PostService.findOne({ _id: postId })];
                        case 1:
                            post = _a.sent();
                            if (!post) return [3 /*break*/, 6];
                            if (!post.narration) return [3 /*break*/, 4];
                            return [4 /*yield*/, media_service_1.MediaService.delete(post.narration.male)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, media_service_1.MediaService.delete(post.narration.female)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [4 /*yield*/, post_service_1.PostService.updateOne({ _id: postId }, { narration: null })];
                        case 5:
                            post = _a.sent();
                            res.status(200).send({ post: post });
                            return [3 /*break*/, 7];
                        case 6:
                            res.status(400).send();
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
    metrics: {
        get: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var users, members, moderators, admins, posts, comments, medias, year, month, analytics;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.ADMIN)) return [3 /*break*/, 12];
                            return [4 /*yield*/, user_service_1.UserService.count({ role: 0 })];
                        case 1:
                            users = _a.sent();
                            return [4 /*yield*/, user_service_1.UserService.count({ role: 1 })];
                        case 2:
                            members = _a.sent();
                            return [4 /*yield*/, user_service_1.UserService.count({ role: 2 })];
                        case 3:
                            moderators = _a.sent();
                            return [4 /*yield*/, user_service_1.UserService.count({ role: 3 })];
                        case 4:
                            admins = _a.sent();
                            return [4 /*yield*/, post_service_1.PostService.count({ draft: false })];
                        case 5:
                            posts = _a.sent();
                            return [4 /*yield*/, comment_service_1.CommentService.count()];
                        case 6:
                            comments = _a.sent();
                            return [4 /*yield*/, media_service_1.MediaService.count()];
                        case 7:
                            medias = _a.sent();
                            year = new Date().getFullYear();
                            month = new Date().getMonth();
                            analytics = void 0;
                            if (!(month > 3)) return [3 /*break*/, 9];
                            return [4 /*yield*/, analytics_service_1.AnalyticsService.find({ year: new Date().getFullYear(), month: { $gte: new Date().getMonth() - 3, $lte: new Date().getMonth() } })];
                        case 8:
                            analytics = _a.sent();
                            return [3 /*break*/, 11];
                        case 9: return [4 /*yield*/, analytics_service_1.AnalyticsService.find({ $or: [{ year: year - 1, month: { $gte: 12 - month, $lte: 12 } }, { year: year, month: { $lte: month } }] })];
                        case 10:
                            analytics = _a.sent();
                            _a.label = 11;
                        case 11:
                            res.status(200).send({ users: users, members: members, moderators: moderators, posts: posts, comments: comments, medias: medias, analytics: analytics });
                            return [3 /*break*/, 13];
                        case 12:
                            res.status(401).send();
                            _a.label = 13;
                        case 13: return [2 /*return*/];
                    }
                });
            });
        }
    },
    accountMetrics: {
        get: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var roleName, role, data, _a, _b, users, members, moderators;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.ADMIN)) return [3 /*break*/, 9];
                            roleName = req.params.role;
                            if (!roleName) return [3 /*break*/, 4];
                            if (!(roleName.toUpperCase() in user_model_1.UserRole)) return [3 /*break*/, 2];
                            role = user_model_1.UserRole[roleName.toUpperCase()];
                            data = {};
                            _a = data;
                            _b = "count";
                            return [4 /*yield*/, user_service_1.UserService.count({ role: role })];
                        case 1:
                            _a[_b] = _c.sent();
                            res.status(200).send(data);
                            return [3 /*break*/, 3];
                        case 2:
                            res.status(404).send();
                            _c.label = 3;
                        case 3: return [3 /*break*/, 8];
                        case 4: return [4 /*yield*/, user_service_1.UserService.count({ role: 0 })];
                        case 5:
                            users = _c.sent();
                            return [4 /*yield*/, user_service_1.UserService.count({ role: 1 })];
                        case 6:
                            members = _c.sent();
                            return [4 /*yield*/, user_service_1.UserService.count({ role: 2 })];
                        case 7:
                            moderators = _c.sent();
                            res.status(200).send({ users: users, members: members, moderators: moderators });
                            _c.label = 8;
                        case 8: return [3 /*break*/, 10];
                        case 9:
                            res.status(401).send();
                            _c.label = 10;
                        case 10: return [2 /*return*/];
                    }
                });
            });
        }
    },
    analytics: {
        get: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, skip, limit, startYear, endYear, startMonth, endMonth, analytics;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.ADMIN)) return [3 /*break*/, 2];
                            filters = req.query;
                            skip = filters.skip ? parseInt(filters.skip) : 0;
                            limit = filters.limit ? Math.min(15, parseInt(filters.limit)) : 15;
                            startYear = filters.startYear ? parseInt(filters.startYear) : new Date().getFullYear();
                            endYear = filters.endYear ? parseInt(filters.endYear) : (new Date().getFullYear() + 1);
                            startMonth = filters.startMonth ? parseInt(filters.startMonth) : new Date().getMonth();
                            endMonth = filters.endMonth ? parseInt(filters.endMonth) : (new Date().getMonth() + 1);
                            return [4 /*yield*/, analytics_service_1.AnalyticsService.find({ year: { $gte: startYear, $lt: endYear }, month: { $gte: startMonth, $lt: endMonth } }, { skip: skip, limit: limit, sort: '-createdAt' })];
                        case 1:
                            analytics = _a.sent();
                            res.status(200).send({ analytics: analytics });
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
    _statics: {
        put: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var statics;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username && req.context.role >= user_model_1.UserRole.ADMIN)) return [3 /*break*/, 2];
                            return [4 /*yield*/, _static_service_1.Statics.update(req.body)];
                        case 1:
                            statics = _a.sent();
                            res.status(200).send(statics);
                            return [3 /*break*/, 3];
                        case 2:
                            res.status(401).send();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    }
});
