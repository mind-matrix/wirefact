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
exports.UserController = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var user_service_1 = require("../service/user.service");
var comment_service_1 = require("../service/comment.service");
var post_service_1 = require("../service/post.service");
var _static_service_1 = require("../service/_static.service");
var media_service_1 = require("../service/media.service");
var lodash_1 = __importDefault(require("lodash"));
var invitation_service_1 = require("../service/invitation.service");
var mail_service_1 = require("../service/mail.service");
var unique_names_generator_1 = require("unique-names-generator");
var libphonenumber_js_1 = require("libphonenumber-js");
exports.UserController = {
    invitation: {
        get: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var code, invitation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = req.params.code;
                            if (!code) return [3 /*break*/, 2];
                            return [4 /*yield*/, invitation_service_1.InvitationService.findOne({ code: code })];
                        case 1:
                            invitation = _a.sent();
                            if (invitation) {
                                res.status(200).send({ invitation: invitation });
                            }
                            else {
                                res.status(404).send();
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            res.status(400).send();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        put: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var code, password, invitation, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = req.params.code;
                            if (!code) return [3 /*break*/, 8];
                            password = req.body.password;
                            if (!password) return [3 /*break*/, 6];
                            return [4 /*yield*/, invitation_service_1.InvitationService.findOne({ code: code })];
                        case 1:
                            invitation = _a.sent();
                            if (!invitation) return [3 /*break*/, 4];
                            return [4 /*yield*/, user_service_1.UserService.create({
                                    username: invitation.username,
                                    name: invitation.name,
                                    email: invitation.email,
                                    password: password,
                                    badges: invitation.badges,
                                    role: invitation.role
                                })];
                        case 2:
                            user = _a.sent();
                            return [4 /*yield*/, invitation_service_1.InvitationService.deleteOne({ code: invitation.code })];
                        case 3:
                            _a.sent();
                            res.status(200).send();
                            return [3 /*break*/, 5];
                        case 4:
                            res.status(404).send();
                            _a.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            res.status(400).send();
                            _a.label = 7;
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            res.status(400).send();
                            _a.label = 9;
                        case 9: return [2 /*return*/];
                    }
                });
            });
        }
    },
    resetPassword: {
        get: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var identifier, _a, code, user;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            identifier = req.params.identifier;
                            if (!identifier) return [3 /*break*/, 2];
                            return [4 /*yield*/, user_service_1.UserService.createPasswordRequest({ $or: [{ username: identifier }, { email: identifier }] })];
                        case 1:
                            _a = _b.sent(), code = _a.code, user = _a.user;
                            if (code && user) {
                                mail_service_1.MailService.sendTemplated(user.email, "resetpwd", { name: user.name, code: code });
                                res.status(200).send();
                            }
                            else {
                                res.status(500).send();
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            res.status(400).send();
                            _b.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        post: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, code, password;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = req.body, code = _a.code, password = _a.password;
                            if (!(code && password)) return [3 /*break*/, 2];
                            return [4 /*yield*/, user_service_1.UserService.resetPassword(code, password)];
                        case 1:
                            _b.sent();
                            res.status(200).send();
                            return [3 /*break*/, 3];
                        case 2:
                            res.status(400).send();
                            _b.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    },
    register: {
        post: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var data, phoneNumber, invitation, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            data = lodash_1.default.pick(req.body, ["username", "name", "email", "phone", "password"]);
                            if (!data.username) {
                                data.username = unique_names_generator_1.uniqueNamesGenerator({
                                    dictionaries: [unique_names_generator_1.colors, unique_names_generator_1.adjectives, unique_names_generator_1.animals],
                                    style: 'lowerCase'
                                });
                            }
                            if (data.phone) {
                                phoneNumber = libphonenumber_js_1.parsePhoneNumber(data.phone, "IN");
                                if (!phoneNumber.isValid())
                                    throw new Error("invalid phone number");
                                data.phone = phoneNumber.number;
                            }
                            return [4 /*yield*/, invitation_service_1.InvitationService.findOne({ email: data.email })];
                        case 1:
                            invitation = _a.sent();
                            if (!invitation) return [3 /*break*/, 3];
                            data.role = invitation.role;
                            return [4 /*yield*/, invitation_service_1.InvitationService.deleteOne({ email: data.email })];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [4 /*yield*/, user_service_1.UserService.create(data)];
                        case 4:
                            user = _a.sent();
                            res.status(200).send({ user: user });
                            return [2 /*return*/];
                    }
                });
            });
        }
    },
    login: {
        post: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, identifier, password, _b, isValid, user, payload, token;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = req.body, identifier = _a.identifier, password = _a.password;
                            if (!(identifier && password)) return [3 /*break*/, 2];
                            return [4 /*yield*/, user_service_1.UserService.validate(identifier, password)];
                        case 1:
                            _b = _c.sent(), isValid = _b.isValid, user = _b.user;
                            if (isValid && user) {
                                payload = { username: user.username, role: user.role };
                                token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET);
                                res.status(200).send({ user: user, token: token });
                            }
                            else {
                                res.status(401).send();
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            res.status(400).send();
                            _c.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    },
    auth: {
        all: function (req, res, next) {
            var token = req.headers["authorization"] || req.headers["Authorization"] || null;
            if (!token)
                req.context = {};
            else {
                var payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                req.context = payload;
            }
            next();
        }
    },
    profileExists: {
        post: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var data, exists;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            data = lodash_1.default.pick(req.body, ["username", "email", "phone"]);
                            if (!(data.username || data.email || data.phone)) return [3 /*break*/, 2];
                            return [4 /*yield*/, user_service_1.UserService.exists(data)];
                        case 1:
                            exists = _a.sent();
                            res.status(200).send({ exists: exists });
                            return [3 /*break*/, 3];
                        case 2:
                            res.status(400).send();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    },
    profile: {
        get: function (req, res, next) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var username, user, _c, username_1, role, user;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            username = req.params.username;
                            if (!username) return [3 /*break*/, 2];
                            return [4 /*yield*/, user_service_1.UserService.findOne({ username: username })];
                        case 1:
                            user = _d.sent();
                            if (!user)
                                res.status(404).send();
                            else {
                                if (!((_a = user.privacy) === null || _a === void 0 ? void 0 : _a.emailPublic))
                                    delete user.email;
                                if (!((_b = user.privacy) === null || _b === void 0 ? void 0 : _b.phonePublic))
                                    delete user.phone;
                                delete user.privacy;
                                res.status(200).send({ user: user });
                            }
                            return [3 /*break*/, 5];
                        case 2:
                            _c = req.context, username_1 = _c.username, role = _c.role;
                            if (!username_1) return [3 /*break*/, 4];
                            return [4 /*yield*/, user_service_1.UserService.findOne({ username: username_1, role: role })];
                        case 3:
                            user = _d.sent();
                            if (!user)
                                res.status(404).send();
                            else
                                res.status(200).send({ user: user });
                            return [3 /*break*/, 5];
                        case 4:
                            res.status(401).send();
                            _d.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        },
        put: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var updates, _a, username, role, phoneNumber, user;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            updates = lodash_1.default.pick(req.body, ["name", "phone", "privacy"]);
                            _a = req.context, username = _a.username, role = _a.role;
                            if (!username) return [3 /*break*/, 2];
                            if (updates.phone) {
                                phoneNumber = libphonenumber_js_1.parsePhoneNumber(updates.phone, "IN");
                                if (!phoneNumber.isValid())
                                    return [2 /*return*/, res.status(400).send("Invalid phone number")];
                                updates.phone = phoneNumber.number;
                            }
                            return [4 /*yield*/, user_service_1.UserService.updateOne({ username: username }, updates)];
                        case 1:
                            user = _b.sent();
                            if (!user)
                                res.status(400).send();
                            else
                                res.status(200).send({ user: user });
                            return [3 /*break*/, 3];
                        case 2:
                            res.status(401).send();
                            _b.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    },
    post: {
        get: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var postId, post, username, views, ip, views;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            postId = req.params.postId;
                            if (!postId) return [3 /*break*/, 8];
                            return [4 /*yield*/, post_service_1.PostService.findOne({ _id: postId, draft: false })];
                        case 1:
                            post = _a.sent();
                            if (!post) return [3 /*break*/, 6];
                            if (!(req.context && req.context.username)) return [3 /*break*/, 3];
                            username = req.context.username;
                            return [4 /*yield*/, post_service_1.PostService.addView({ _id: postId }, { username: username })];
                        case 2:
                            views = _a.sent();
                            if (views) {
                                post.metrics.views = views;
                            }
                            return [3 /*break*/, 5];
                        case 3:
                            ip = (req.headers['client-fingerprint'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress);
                            return [4 /*yield*/, post_service_1.PostService.addView({ _id: postId }, { ip: ip })];
                        case 4:
                            views = _a.sent();
                            if (views) {
                                post.metrics.views = views;
                            }
                            _a.label = 5;
                        case 5:
                            res.status(200).send({ post: post });
                            return [3 /*break*/, 7];
                        case 6:
                            res.status(404).send();
                            _a.label = 7;
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            res.status(400).send();
                            _a.label = 9;
                        case 9: return [2 /*return*/];
                    }
                });
            });
        }
    },
    posts: {
        get: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, skip, limit, projection, posts, posts;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            filters = req.query;
                            skip = filters.skip ? parseInt(filters.skip) : 0;
                            limit = filters.limit ? Math.min(15, parseInt(filters.limit)) : 15;
                            projection = filters.content ? null : '-content';
                            if (!(req.context && req.context.username)) return [3 /*break*/, 2];
                            return [4 /*yield*/, post_service_1.PostService.find({ draft: false }, { skip: skip, limit: limit, sort: '-createdAt' }, projection)];
                        case 1:
                            posts = _a.sent();
                            res.status(200).send({ posts: posts });
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, post_service_1.PostService.find({ draft: false }, { skip: skip, limit: limit, sort: '-createdAt' }, projection)];
                        case 3:
                            posts = _a.sent();
                            res.status(200).send({ posts: posts });
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    },
    countPosts: {
        get: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var username, user, count, user, count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            username = req.params.username;
                            if (!username) return [3 /*break*/, 5];
                            return [4 /*yield*/, user_service_1.UserService.findOne({ username: username })];
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
                        case 4: return [3 /*break*/, 11];
                        case 5:
                            if (!(req.context && req.context.username)) return [3 /*break*/, 10];
                            return [4 /*yield*/, user_service_1.UserService.findOne({ username: req.context.username })];
                        case 6:
                            user = _a.sent();
                            if (!user) return [3 /*break*/, 8];
                            return [4 /*yield*/, post_service_1.PostService.count({ author: user.id, draft: false })];
                        case 7:
                            count = _a.sent();
                            res.status(200).send({ count: count });
                            return [3 /*break*/, 9];
                        case 8:
                            res.status(404).send();
                            _a.label = 9;
                        case 9: return [3 /*break*/, 11];
                        case 10:
                            res.status(400).send();
                            _a.label = 11;
                        case 11: return [2 /*return*/];
                    }
                });
            });
        }
    },
    searchPosts: {
        get: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, query, skip, limit, projection, posts;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            filters = req.query;
                            query = filters.q;
                            skip = filters.skip ? parseInt(filters.skip) : 0;
                            limit = filters.limit ? Math.min(15, parseInt(filters.limit)) : 15;
                            projection = filters.content ? null : '-content';
                            if (!query) return [3 /*break*/, 2];
                            return [4 /*yield*/, post_service_1.PostService.find({ $text: { $search: query } }, { skip: skip, limit: limit, sort: '-createdAt' }, projection)];
                        case 1:
                            posts = _a.sent();
                            res.status(200).send({ posts: posts });
                            return [3 /*break*/, 3];
                        case 2:
                            res.status(400).send();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    },
    comment: {
        get: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, id, postId, comment, filters, skip, limit, comments;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = req.query, id = _a.id, postId = _a.postId;
                            if (!id) return [3 /*break*/, 2];
                            return [4 /*yield*/, comment_service_1.CommentService.findOne({ _id: id })];
                        case 1:
                            comment = _b.sent();
                            res.status(200).send({ comment: comment });
                            return [3 /*break*/, 5];
                        case 2:
                            if (!postId) return [3 /*break*/, 4];
                            filters = req.query;
                            skip = filters.skip ? parseInt(filters.skip) : 0;
                            limit = filters.limit ? Math.min(15, parseInt(filters.limit)) : 15;
                            return [4 /*yield*/, comment_service_1.CommentService.find({ postId: postId }, { skip: skip, limit: limit, sort: '-createdAt' })];
                        case 3:
                            comments = _b.sent();
                            res.status(200).send({ comments: comments });
                            return [3 /*break*/, 5];
                        case 4:
                            res.status(400).send();
                            _b.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        },
        post: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var user, data, comment;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username)) return [3 /*break*/, 5];
                            return [4 /*yield*/, user_service_1.UserService.findOne({ username: req.context.username })];
                        case 1:
                            user = _a.sent();
                            if (!user) return [3 /*break*/, 3];
                            data = lodash_1.default.pick(req.body, ["postId", "content", "mentions"]);
                            data.author = user.id;
                            return [4 /*yield*/, comment_service_1.CommentService.create(data)];
                        case 2:
                            comment = _a.sent();
                            res.status(200).send({ comment: comment });
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
                var user, commentId, data, comment;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.context && req.context.username)) return [3 /*break*/, 7];
                            return [4 /*yield*/, user_service_1.UserService.findOne({ username: req.context.username })];
                        case 1:
                            user = _a.sent();
                            if (!user) return [3 /*break*/, 5];
                            commentId = req.params.commentId;
                            if (!commentId) return [3 /*break*/, 3];
                            data = lodash_1.default.pick(req.body, ["content", "mentions"]);
                            return [4 /*yield*/, comment_service_1.CommentService.updateOne({ _id: commentId, author: user.id }, data)];
                        case 2:
                            comment = _a.sent();
                            if (!comment)
                                res.status(404).send();
                            else
                                res.status(200).send({ comment: comment });
                            return [3 /*break*/, 4];
                        case 3:
                            res.status(400).send();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            res.status(404).send();
                            _a.label = 6;
                        case 6: return [3 /*break*/, 8];
                        case 7:
                            res.status(401).send();
                            _a.label = 8;
                        case 8: return [2 /*return*/];
                    }
                });
            });
        }
    },
    media: {
        get: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var mediaId, media;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mediaId = req.params.mediaId;
                            return [4 /*yield*/, media_service_1.MediaService.findOne({ _id: mediaId })];
                        case 1:
                            media = _a.sent();
                            if (media) {
                                res.status(200).send({ media: media });
                            }
                            else {
                                res.status(404).send();
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
    },
    _statics: {
        get: function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var statics;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _static_service_1.Statics.get()];
                        case 1:
                            statics = _a.sent();
                            res.status(200).send(statics);
                            return [2 /*return*/];
                    }
                });
            });
        }
    }
};
