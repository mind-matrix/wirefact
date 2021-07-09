"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
var wirefact_app_1 = __importDefault(require("./apps/wirefact.app"));
var serverless_http_1 = __importDefault(require("serverless-http"));
var mongoose_1 = require("mongoose");
dotenv_1.default.config();
mongoose_1.connect(process.env.DB_URL, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, function () {
    console.log("Connected to database \uD83D\uDCF0");
});
// app.listen(process.env.PORT!, () => { console.log(`Server running 🚀`) }) // FOR LOCAL TESTING
exports.handler = serverless_http_1.default(wirefact_app_1.default);
