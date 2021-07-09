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
var ava_ts_1 = __importDefault(require("ava-ts"));
var mongoose_1 = require("mongoose");
var dotenv_1 = __importDefault(require("dotenv"));
var user_controller_1 = require("./user.controller");
var lodash_1 = __importDefault(require("lodash"));
dotenv_1.default.config();
var TestResponse = /** @class */ (function () {
    function TestResponse(cb) {
        this.cb = cb;
        this.code = 500;
        this.payload = null;
    }
    TestResponse.prototype.status = function (code) {
        this.code = code;
        return this;
    };
    TestResponse.prototype.send = function (payload) {
        this.payload = payload;
        this.cb(this.code, this.payload);
        return this;
    };
    return TestResponse;
}());
function makeResponse(cb) {
    if (cb === void 0) { cb = function () { }; }
    var res = new TestResponse(cb);
    return res;
}
var db, token;
ava_ts_1.default.before(function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mongoose_1.connect(process.env.DB_URL, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })];
                case 1:
                    db = _a.sent();
                    return [4 /*yield*/, db.connection.db.dropDatabase()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
ava_ts_1.default.serial("register", function (t) {
    return __awaiter(this, void 0, void 0, function () {
        var req, res, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    req = {
                        body: {
                            username: "johndoe",
                            name: "John Doe",
                            email: "example@example.com",
                            phone: "+917005878172",
                            password: "password"
                        }
                    };
                    res = makeResponse(function (code, payload) {
                        if (code === 200) {
                            t.is(payload.user.username, req.body.username);
                        }
                        else {
                            t.fail(payload.error);
                        }
                    });
                    next = (function () { });
                    return [4 /*yield*/, user_controller_1.UserController.register.post(req, res, next)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
ava_ts_1.default.serial("login", function (t) {
    return __awaiter(this, void 0, void 0, function () {
        var req, res, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    req = {
                        body: {
                            identifier: "johndoe",
                            password: "password"
                        }
                    };
                    res = makeResponse(function (code, payload) {
                        if (code === 200) {
                            t.true(lodash_1.default.values(lodash_1.default.pick(payload.user, ["username", "email", "phone"])).reduce(function (a, v) { return a || (v && v === req.body.identifier); }, false));
                            t.truthy(payload.token);
                            token = payload.token;
                        }
                        else {
                            t.fail(payload.error);
                        }
                    });
                    next = (function () { });
                    return [4 /*yield*/, user_controller_1.UserController.login.post(req, res, next)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
ava_ts_1.default.serial("auth", function (t) {
    return __awaiter(this, void 0, void 0, function () {
        var req, res, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    req = {
                        headers: {
                            authorization: token
                        }
                    };
                    res = makeResponse();
                    next = (function () { });
                    return [4 /*yield*/, user_controller_1.UserController.auth.all(req, res, next)];
                case 1:
                    _a.sent();
                    t.is(req.context.username, "johndoe");
                    return [2 /*return*/];
            }
        });
    });
});
ava_ts_1.default.serial("get profile", function (t) {
    return __awaiter(this, void 0, void 0, function () {
        var req, res, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    req = {
                        context: {
                            username: "johndoe",
                            role: "user"
                        }
                    };
                    res = makeResponse(function (code, payload) {
                        if (code === 200) {
                            t.is(payload.user.username, req.context.username);
                        }
                        else {
                            t.fail(payload.error);
                        }
                    });
                    next = (function () { });
                    return [4 /*yield*/, user_controller_1.UserController.profile.get(req, res, next)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
ava_ts_1.default.serial("update profile", function (t) {
    return __awaiter(this, void 0, void 0, function () {
        var req, res, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    req = {
                        context: {
                            username: "johndoe",
                            role: "user"
                        },
                        body: {
                            name: "John J. Doe"
                        }
                    };
                    res = makeResponse(function (code, payload) {
                        if (code === 200) {
                            t.is(payload.user.name, req.body.name);
                        }
                        else {
                            t.fail(payload.error);
                        }
                    });
                    next = (function () { });
                    return [4 /*yield*/, user_controller_1.UserController.profile.put(req, res, next)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
ava_ts_1.default.after(function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.connection.db.dropDatabase()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db.connection.close()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
