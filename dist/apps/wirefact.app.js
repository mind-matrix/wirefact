"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var compression_1 = __importDefault(require("compression"));
var express_1 = __importDefault(require("express"));
var controller_1 = require("../src/controller");
var cors_1 = __importDefault(require("cors"));
var analytics_controller_1 = require("../src/controller/analytics.controller");
var app = express_1.default();
app.use(cors_1.default());
app.use(compression_1.default());
app.use(express_1.default.json());
app.use(analytics_controller_1.AnalyticsController.visits.all);
// BASE API
app.post("/register", controller_1.Controller.register.post);
app.post("/login", controller_1.Controller.login.post);
app.get("/profile", controller_1.Controller.auth.all, controller_1.Controller.profile.get);
app.get("/profile/:username", controller_1.Controller.auth.all, controller_1.Controller.profile.get);
app.put("/profile", controller_1.Controller.auth.all, controller_1.Controller.profile.put);
app.post("/profile-exists", controller_1.Controller.auth.all, controller_1.Controller.profileExists.post);
app.get("/posts", controller_1.Controller.auth.all, controller_1.Controller.posts.get);
app.get("/posts/:username/count", controller_1.Controller.auth.all, controller_1.Controller.countPosts.get);
app.get("/posts/count", controller_1.Controller.auth.all, controller_1.Controller.countPosts.get);
app.get("/posts/search", controller_1.Controller.auth.all, controller_1.Controller.searchPosts.get);
app.get("/post/:postId", controller_1.Controller.auth.all, controller_1.Controller.post.get);
app.get("/comment", controller_1.Controller.auth.all, controller_1.Controller.comment.get); // ?id=xyz&postId=pqr
app.post("/comment", controller_1.Controller.auth.all, controller_1.Controller.comment.post);
app.put("/comment", controller_1.Controller.auth.all, controller_1.Controller.comment.put);
app.get("/media/:mediaId", controller_1.Controller.media.get);
app.get("/invitation/:code", controller_1.Controller.auth.all, controller_1.Controller.invitation.get);
app.put("/invitation/:code", controller_1.Controller.auth.all, controller_1.Controller.invitation.put);
app.get("/_statics", controller_1.Controller._statics.get);
app.get("/reset-password/:identifier", controller_1.Controller.resetPassword.get);
app.post("/reset-password", controller_1.Controller.resetPassword.post);
// MEMBER EXTENSION
app.post("/post", controller_1.Controller.auth.all, controller_1.Controller.post.post);
app.put("/post/:postId", controller_1.Controller.auth.all, controller_1.Controller.post.put);
app.delete("/post/:postId", controller_1.Controller.auth.all, controller_1.Controller.post.delete);
app.get("/draft/:postId", controller_1.Controller.auth.all, controller_1.Controller.draft.get);
app.get("/drafts", controller_1.Controller.auth.all, controller_1.Controller.drafts.get);
app.get("/drafts/count", controller_1.Controller.auth.all, controller_1.Controller.countDrafts.get);
app.get("/published-post/:postId", controller_1.Controller.auth.all, controller_1.Controller.publishedPost.get);
app.get("/published-posts", controller_1.Controller.auth.all, controller_1.Controller.publishedPosts.get);
app.get("/published-posts/count", controller_1.Controller.auth.all, controller_1.Controller.countPublishedPosts.get);
app.post("/sign-media", controller_1.Controller.auth.all, controller_1.Controller.signMedia.post);
app.post("/media", controller_1.Controller.auth.all, controller_1.Controller.media.post);
app.put("/media/:mediaId", controller_1.Controller.auth.all, controller_1.Controller.media.put);
app.delete("/media/:mediaId", controller_1.Controller.auth.all, controller_1.Controller.media.delete);
app.get("/medias", controller_1.Controller.auth.all, controller_1.Controller.medias.get);
app.get("/medias/count", controller_1.Controller.auth.all, controller_1.Controller.countMedias.get);
app.get("/media-usage", controller_1.Controller.auth.all, controller_1.Controller.mediaUsage.get);
app.get("/badge/:badgeId", controller_1.Controller.auth.all, controller_1.Controller.badge.get);
app.get("/badges", controller_1.Controller.auth.all, controller_1.Controller.badges.get);
// MODERATOR EXTENSION
app.post("/assign-badge", controller_1.Controller.auth.all, controller_1.Controller.assignBadge.post);
app.get("/narration/:postId", controller_1.Controller.auth.all, controller_1.Controller.narration.get);
// ADMIN EXTENSION
app.post("/badge", controller_1.Controller.badge.post);
app.put("/badge", controller_1.Controller.badge.put);
app.put("/profile/:username", controller_1.Controller.profile.put);
app.post("/invitation", controller_1.Controller.auth.all, controller_1.Controller.invitation.post);
app.put("/_statics", controller_1.Controller.auth.all, controller_1.Controller._statics.put);
app.get("/metrics", controller_1.Controller.auth.all, controller_1.Controller.metrics.get);
app.get("/metrics/accounts", controller_1.Controller.auth.all, controller_1.Controller.accountMetrics.get);
app.get("/metrics/accounts/:role", controller_1.Controller.auth.all, controller_1.Controller.accountMetrics.get);
app.get("/metrics/analytics", controller_1.Controller.auth.all, controller_1.Controller.analytics.get);
exports.default = app;
