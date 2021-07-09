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
exports.MediaService = void 0;
var lodash_1 = __importDefault(require("lodash"));
var media_model_1 = require("../model/media.model");
var user_service_1 = require("./user.service");
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var uniqid_1 = __importDefault(require("uniqid"));
aws_sdk_1.default.config.update({
    region: 'ap-south-1',
    signatureVersion: 'v4'
});
var MediaService = /** @class */ (function () {
    function MediaService() {
    }
    MediaService.sanitize = function (media) {
        return __awaiter(this, void 0, void 0, function () {
            var fields, _a;
            var _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        fields = ["id", "key", "filesize", "filename", "filetype", "encoding", "metadata"];
                        if (!media)
                            return [2 /*return*/, null];
                        if (Array.isArray(media))
                            return [2 /*return*/, Promise.all(media.map(function (m) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a;
                                    var _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                _a = [__assign({}, lodash_1.default.pick(m.toJSON({ virtuals: true }), fields))];
                                                _b = {};
                                                return [4 /*yield*/, user_service_1.UserService.sanitize(m.owner)];
                                            case 1: return [2 /*return*/, __assign.apply(void 0, _a.concat([(_b.owner = _c.sent(), _b)]))];
                                        }
                                    });
                                }); }))];
                        _a = [__assign({}, lodash_1.default.pick(media.toJSON({ virtuals: true }), fields))];
                        _b = {};
                        return [4 /*yield*/, user_service_1.UserService.sanitize(media.owner)];
                    case 1: return [2 /*return*/, __assign.apply(void 0, _a.concat([(_b.owner = _c.sent(), _b)]))];
                }
            });
        });
    };
    MediaService.signRequest = function (request) {
        var s3 = new aws_sdk_1.default.S3();
        var key = uniqid_1.default() + "_" + request.filename;
        var signedRequest = s3.getSignedUrl("putObject", {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
            Expires: 60,
            ContentType: request.filetype,
            ACL: "public-read"
        });
        return { signedRequest: signedRequest, key: key, url: "https://" + process.env.AWS_S3_BUCKET + ".s3.ap-south-1.amazonaws.com/" + key };
    };
    MediaService.upload = function (key, body, contentType, isPublic) {
        if (isPublic === void 0) { isPublic = true; }
        return __awaiter(this, void 0, void 0, function () {
            var s3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        s3 = new aws_sdk_1.default.S3();
                        return [4 /*yield*/, s3.putObject({
                                Bucket: process.env.AWS_S3_BUCKET,
                                Key: key,
                                Body: body,
                                ContentType: contentType,
                                ACL: isPublic ? "public-read" : undefined
                            }).promise()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MediaService.delete = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var s3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        s3 = new aws_sdk_1.default.S3();
                        return [4 /*yield*/, s3.deleteObject({
                                Bucket: process.env.AWS_S3_BUCKET,
                                Key: key
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MediaService.usage = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var medias, available, used, remaining;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, media_model_1.MediaModel.find(filters)];
                    case 1:
                        medias = _a.sent();
                        available = parseInt(process.env.DRIVE_SPACE);
                        used = medias.map(function (media) { return media.filesize; }).reduce(function (a, v) { return a + v; }, 0);
                        remaining = available - used;
                        return [2 /*return*/, {
                                available: available,
                                used: used,
                                remaining: remaining
                            }];
                }
            });
        });
    };
    MediaService.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var s3, media, err, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        s3 = new aws_sdk_1.default.S3();
                        return [4 /*yield*/, s3.headObject({ Bucket: process.env.AWS_S3_BUCKET, Key: data.key }).promise()];
                    case 1:
                        _a.sent();
                        media = new media_model_1.MediaModel(data);
                        err = media.validateSync();
                        if (err)
                            throw Error("invalid media document");
                        return [4 /*yield*/, media.save()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, media.populate("owner").execPopulate()];
                    case 3:
                        media = _a.sent();
                        return [4 /*yield*/, this.sanitize(media)];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5:
                        err_1 = _a.sent();
                        throw Error("invalid object details");
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    MediaService.findOne = function (filters, options) {
        if (filters === void 0) { filters = {}; }
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var media;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, media_model_1.MediaModel.findOne(filters, null, options).populate("owner")];
                    case 1:
                        media = _a.sent();
                        if (!media)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, this.sanitize(media)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MediaService.find = function (filters, options) {
        if (filters === void 0) { filters = {}; }
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var media;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, media_model_1.MediaModel.find(filters, null, options).populate("owner")];
                    case 1:
                        media = _a.sent();
                        return [4 /*yield*/, this.sanitize(media)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MediaService.count = function (filters) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, media_model_1.MediaModel.count(filters)];
                    case 1:
                        count = _a.sent();
                        return [2 /*return*/, count];
                }
            });
        });
    };
    MediaService.updateOne = function (filters, updates) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var media;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, media_model_1.MediaModel.findOneAndUpdate(filters, updates, { new: true }).populate("owner")];
                    case 1:
                        media = _a.sent();
                        if (!media)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, this.sanitize(media)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MediaService.deleteOne = function (filters) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var media;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, media_model_1.MediaModel.findOne(filters)];
                    case 1:
                        media = _a.sent();
                        if (!media)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, this.delete(media.key)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, media.remove()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.sanitize(media)];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return MediaService;
}());
exports.MediaService = MediaService;
