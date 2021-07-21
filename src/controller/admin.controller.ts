import { RequestHandler } from "express";
import _ from "lodash";
import { UserRole } from "../model/user.model";
import { AnalyticsService } from "../service/analytics.service";
import { BadgeService } from "../service/badge.service";
import { CommentService } from "../service/comment.service";
import { InvitationService } from "../service/invitation.service";
import { MailService } from "../service/mail.service";
import { MediaService } from "../service/media.service";
import { PostService } from "../service/post.service";
import { TwitterService } from "../service/twitter.service";
import { UserService } from "../service/user.service";
import { Statics } from "../service/_static.service";
import { IController } from "./icontroller";
import { prepareTextForTweet } from "./member.controller";
import { ModeratorController } from "./moderator.controller";

export const AdminController = _.merge(
    _.cloneDeep(ModeratorController),
{
    badge: {
        async post(req, res, next) {
            if (req.context && req.context.username && req.context.role >= UserRole.ADMIN) {
                let badge = await BadgeService.create(req.body)
                res.status(200).send({ badge })
            } else {
                res.status(401).send()
            }
        },
        async put(req, res, next) {
            if (req.context && req.context.username && req.context.role >= UserRole.ADMIN) {
                let { badgeId } = req.params
                let data = _.pick(req.body, ["name","description"])
                let badge = await BadgeService.updateOne({ _id: badgeId }, data)
                if (!badge) res.status(404).send()
                else res.status(200).send({ badge })
            } else {
                res.status(401).send()
            }
        }
    },
    invitation: {
        async post(req, res, next) {
            if (req.context && req.context.username && req.context.role >= UserRole.ADMIN) {
                let data = req.body
                let invitation = await InvitationService.create(data)
                await MailService.sendTemplated(invitation.email, "invitation", { name: invitation.name, invitationId: invitation.code })
                res.status(200).send({ invitation })
            } else {
                res.status(401).send()
            }
        }
    },
    profile: {
        async put(req, res, next) {
            if (req.context && req.context.username) {
                let { username } = req.params
                let user
                if (username && req.context.role >= UserRole.ADMIN) {
                    let updates = <any>_.pick(req.body, ["role"])
                    user = await UserService.updateOne({ username }, updates)
                    if (!user) res.status(400).send()
                    else res.status(200).send({ user })
                } else {
                    await ModeratorController.profile.put(req, res, next)
                }
            } else {
                res.status(401).send()
            }
        }
    },
    post: {

        async post(req, res, next) {
            if (req.context && req.context.username && req.context.role >= UserRole.ADMIN) {
                let author = await UserService.findOne({ username: <string>req.context.username })
                if (author) {
                    let { skipTweet } = req.query
                    let data = <any>_.pick(req.body, ["cover","title","slug","excerpt","content","topics","hashtags","sources","draft","author","createdAt"])
                    if (!data.author) data.author = author.id
                    let post = await PostService.create(data)
                    
                    // Direct Tweet
                    if (!skipTweet) {
                        const text = await prepareTextForTweet(post)
                        const media = Buffer.from(<any>(await MediaService.download(post.cover.key)).Body, <any>post.cover.filetype)

                        TwitterService.tweet({ text, media })
                    }
                    
                    res.status(200).send({ post })
                } else {
                    res.status(404).send()
                }
            } else {
                await ModeratorController.post.post(req, res, next)
            }
        },

        async put(req, res, next) {
            if (req.context && req.context.username && req.context.role >= UserRole.ADMIN) {
                let { postId } = req.params
                let data = <any>_.pick(req.body, ["cover","title","slug","excerpt","content","topics","hashtags","sources","draft","author","createdAt"])
                let post = await PostService.updateOne({ _id: postId }, data)
                if (!post) res.status(404).send()
                else res.status(200).send({ post })
            } else {
                await ModeratorController.post.put(req, res, next)
            }
        },
    },
    narration: {
        async delete(req, res, next) {
            if (req.context && req.context.username && req.context.role >= UserRole.ADMIN) {
                let { postId } = req.params
                if (postId) {
                    let post = await PostService.findOne({ _id: postId })
                    if (post) {
                        if (post.narration) {
                            await MediaService.delete(post.narration.male)
                            await MediaService.delete(post.narration.female)
                        }
                        post = await PostService.updateOne({ _id: postId }, { narration: null })
                        res.status(200).send({ post })
                    } else {
                        res.status(400).send()
                    }
                } else {
                    res.status(400).send()
                }
            } else {
                res.status(401).send()
            }
        }
    },
    metrics: {
        async get(req, res, next) {
            if (req.context && req.context.username && req.context.role >= UserRole.ADMIN) {
                let users = await UserService.count({ role: 0 })
                let members = await UserService.count({ role: 1 })
                let moderators = await UserService.count({ role: 2 })
                let admins = await UserService.count({ role: 3 })
                let posts = await PostService.count({ draft: false })
                let comments = await CommentService.count()
                let medias = await MediaService.count()
                
                let year = new Date().getFullYear()
                let month = new Date().getMonth()
                let analytics
                if (month > 3) {
                    analytics = await AnalyticsService.find({ year: new Date().getFullYear(), month: { $gte: new Date().getMonth()-3, $lte: new Date().getMonth() } })
                } else {
                    analytics = await AnalyticsService.find({ $or: [{ year: year - 1, month: { $gte: 12 - month, $lte: 12 } }, { year: year, month: { $lte: month } }] })
                }
                res.status(200).send({ users, members, moderators, posts, comments, medias, analytics })
            } else {
                res.status(401).send()
            }
        }
    },
    accountMetrics: {
        async get(req, res, next) {
            if (req.context && req.context.username && req.context.role >= UserRole.ADMIN) {
                let { role: roleName } = req.params as { [k: string]: string }
                if (roleName) {
                    if (roleName.toUpperCase() in UserRole) {
                        let role = UserRole[roleName.toUpperCase() as keyof typeof UserRole]
                        let data: { [k: string]: any } = {}
                        data["count"] = await UserService.count({ role })
                        res.status(200).send(data)
                    } else {
                        res.status(404).send()
                    }
                } else {
                    let users = await UserService.count({ role: 0 })
                    let members = await UserService.count({ role: 1 })
                    let moderators = await UserService.count({ role: 2 })
                    res.status(200).send({ users, members, moderators })
                }
            } else {
                res.status(401).send()
            }
        }
    },
    analytics: {
        async get(req, res, next) {
            if (req.context && req.context.username && req.context.role >= UserRole.ADMIN) {
                let filters = req.query as { [k: string]: string }
                let skip = filters.skip ? parseInt(filters.skip) : 0
                let limit = filters.limit ? Math.min(15, parseInt(filters.limit)) : 15
                let startYear = filters.startYear ? parseInt(filters.startYear) : new Date().getFullYear()
                let endYear = filters.endYear ? parseInt(filters.endYear) : (new Date().getFullYear() + 1)
                let startMonth = filters.startMonth ? parseInt(filters.startMonth) : new Date().getMonth()
                let endMonth = filters.endMonth ? parseInt(filters.endMonth) : (new Date().getMonth() + 1)
                let analytics = await AnalyticsService.find({ year: { $gte: startYear, $lt: endYear }, month: { $gte: startMonth, $lt: endMonth } }, { skip, limit, sort: '-createdAt' })
                res.status(200).send({ analytics })
            } else {
                res.status(401).send()
            }
        }
    },
    _statics: {
        async put(req, res, next) {
            if (req.context && req.context.username && req.context.role >= UserRole.ADMIN) {
                let statics = await Statics.update(req.body)
                res.status(200).send(statics)
            } else {
                res.status(401).send()
            }
        }
    }
} as IController as { [k: string]: { [k: string]: RequestHandler } })
