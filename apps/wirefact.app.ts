import compression from "compression"
import express from "express"
import { Controller } from "../src/controller"
import cors from "cors"
import { AnalyticsController } from "../src/controller/analytics.controller"

const app = express()
app.use(cors())
app.use(compression())
app.use(express.json())

app.use(AnalyticsController.visits.all)

// BASE API
app.post("/register", Controller.register.post)
app.post("/login", Controller.login.post)

app.get("/profile", Controller.auth.all, Controller.profile.get)
app.get("/profile/:username", Controller.auth.all, Controller.profile.get)
app.put("/profile", Controller.auth.all, Controller.profile.put)


app.post("/profile-exists", Controller.auth.all, Controller.profileExists.post)

app.get("/posts", Controller.auth.all, Controller.posts.get)
app.get("/posts/:username/count", Controller.auth.all, Controller.countPosts.get)
app.get("/posts/count", Controller.auth.all, Controller.countPosts.get)

app.get("/posts/search", Controller.auth.all, Controller.searchPosts.get)

app.get("/narrations", Controller.auth.all, Controller.narrations.get)

app.get("/post/:postId", Controller.auth.all, Controller.post.get)
app.post("/post-exists", Controller.auth.all, Controller.postExists.post)

app.get("/comment", Controller.auth.all, Controller.comment.get) // ?id=xyz&postId=pqr
app.post("/comment", Controller.auth.all, Controller.comment.post)
app.put("/comment/:commentId", Controller.auth.all, Controller.comment.put)
app.delete("/comment/:commentId", Controller.auth.all, Controller.comment.delete)

app.get("/media/:mediaId", Controller.media.get)

app.get("/invitation/:code", Controller.auth.all, Controller.invitation.get)
app.put("/invitation/:code", Controller.auth.all, Controller.invitation.put)

app.get("/_statics", Controller._statics.get)

app.get("/reset-password/:identifier", Controller.resetPassword.get)
app.post("/reset-password", Controller.resetPassword.post)

// MEMBER EXTENSION
app.post("/post", Controller.auth.all, Controller.post.post)
app.put("/post/:postId", Controller.auth.all, Controller.post.put)
app.delete("/post/:postId", Controller.auth.all, Controller.post.delete)

app.get("/draft/:postId", Controller.auth.all, Controller.draft.get)
app.get("/drafts", Controller.auth.all, Controller.drafts.get)
app.get("/drafts/count", Controller.auth.all, Controller.countDrafts.get)

app.get("/published-post/:postId", Controller.auth.all, Controller.publishedPost.get)
app.get("/published-posts", Controller.auth.all, Controller.publishedPosts.get)
app.get("/published-posts/count", Controller.auth.all, Controller.countPublishedPosts.get)

app.post("/sign-media", Controller.auth.all, Controller.signMedia.post)

app.post("/media", Controller.auth.all, Controller.media.post)
app.put("/media/:mediaId", Controller.auth.all, Controller.media.put)
app.delete("/media/:mediaId", Controller.auth.all, Controller.media.delete)

app.get("/medias", Controller.auth.all, Controller.medias.get)
app.get("/medias/count", Controller.auth.all, Controller.countMedias.get)

app.get("/media-usage", Controller.auth.all, Controller.mediaUsage.get)

app.get("/badge/:badgeId", Controller.auth.all, Controller.badge.get)
app.get("/badges", Controller.auth.all, Controller.badges.get)

// MODERATOR EXTENSION
app.post("/assign-badge", Controller.auth.all, Controller.assignBadge.post)
app.get("/narration/:postId", Controller.auth.all, Controller.narration.get)

app.get("/profiles", Controller.auth.all, Controller.profiles.get)

// ADMIN EXTENSION
app.post("/badge", Controller.badge.post)
app.put("/badge", Controller.badge.put)

app.put("/profile/:username", Controller.profile.put)

app.post("/invitation", Controller.auth.all, Controller.invitation.post)

app.put("/_statics", Controller.auth.all, Controller._statics.put)

app.get("/metrics", Controller.auth.all, Controller.metrics.get)
app.get("/metrics/accounts", Controller.auth.all, Controller.accountMetrics.get)
app.get("/metrics/accounts/:role", Controller.auth.all, Controller.accountMetrics.get)
app.get("/metrics/analytics", Controller.auth.all, Controller.analytics.get)

export default app
