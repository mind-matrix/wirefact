import { RequestHandler } from "express"
import _ from "lodash"
import { UserRole } from "../model/user.model"
import { BadgeService } from "../service/badge.service"
import { CommentService } from "../service/comment.service"
import { NarrationService } from "../service/narration.service"
import { PostService } from "../service/post.service"
import { UserService } from "../service/user.service"
import { IController } from "./icontroller"
import { MemberController } from "./member.controller"
import { convert } from "html-to-text"
import uniqid from "uniqid"
import { MediaService } from "../service/media.service"

function _extractText(content: any): string {
    if (!content || !Array.isArray(content)) return ""
    let text = []
    for (let item of content) {
        if (item.type === "text" && item.text) {
            text.push(item.text)
        } else if (item.content) {
            text.push(_extractText(item.content))
        }
    }
    return text.join(" ")
}

function extractText(doc: any) {
    return _extractText(doc.content)
}

export const ModeratorController = _.merge(
    _.cloneDeep(MemberController),
    {
        assignBadge: {
            async post(req, res, next) {
                if (req.context && req.context.username && req.context.role >= UserRole.MODERATOR) {
                    let { username, badgeId } = req.body
                    let badge = await BadgeService.findOne({ _id: badgeId })
                    if (badge) {
                        let user = await UserService.updateOne({ username }, { $addToSet: { badges: badge.id } })
                        if (user) res.status(200).send({ user })
                        else res.status(404).send()
                    } else {
                        res.status(404).send()
                    }
                } else {
                    res.status(401).send()
                }
            }
        },
        post: {
            async delete(req, res, next) {
                if (req.context && req.context.username) {
                    let { postId } = req.params
                    if (postId) {
                        let post = await PostService.findOne({ _id: postId })
                        if (post) {
                            if (req.context.role >= UserRole.MODERATOR) {
                                if (post.narration) {
                                    await MediaService.delete(post.narration.male)
                                    await MediaService.delete(post.narration.female)
                                }
                                post = await PostService.updateOne({ _id: postId }, { content: {}, censored: true, narration: null })
                                res.status(200).send({ post })
                            } else {
                                await MemberController.post.delete(req, res, next)
                            }
                        } else {
                            res.status(404).send()
                        }
                    } else {
                        res.status(400).send()
                    }
                } else {
                    res.status(401).send()
                }
            }
        },
        comment: {
            async delete(req, res, next) {
                if (req.context && req.context.username && req.context.role >= UserRole.MODERATOR) {
                    let { commentId } = req.params
                    if (commentId) {
                        let comment = await CommentService.findOne({ _id: commentId })
                        if (comment) {
                            if (comment.author.username === req.context.username) {
                                comment = await CommentService.deleteOne({ _id: commentId })
                            } else {
                                comment = await CommentService.updateOne({ _id: commentId }, { content: {}, censored: true })
                            }
                            res.status(200).send({ comment })
                        } else {
                            res.status(404).send()
                        }
                    } else {
                        res.status(400).send()
                    }
                } else {
                    await MemberController.comment.delete(req, res, next)
                }
            }
        },
        narration: {
            async get(req, res, next) {
                if (req.context && req.context.username && req.context.role >= UserRole.MODERATOR) {
                    let { postId } = req.params
                    if (postId) {
                        let post = await PostService.findOne({ _id: postId })
                        if (post && post.author.username === req.context.username) {
                            if (post.narration) throw Error("narration already created")
                            const rawTextContent = extractText(post.content)
                            const text = convert(rawTextContent, {
                                selectors: [{ selector: 'a', options: { ignoreHref: true } }]
                            })
                            const { male, female } = await NarrationService.generate(text)
                            const key = uniqid()
                            await MediaService.upload(`${key}_male`, male, "audio/mpeg")
                            await MediaService.upload(`${key}_female`, female, "audio/mpeg")
                            post = await PostService.updateOne({ _id: postId }, {
                                narration: {
                                    male: `${key}_male`,
                                    female: `${key}_female`
                                }
                            })
                            res.status(200).send({ post })
                        } else {
                            res.status(404).send()
                        }
                    } else {
                        res.status(404).send()
                    }
                } else {
                    res.status(401).send()
                }
            }
        },
        profiles: {
            async get(req, res, next) {
                if (req.context && req.context.username && req.context.role >= UserRole.MODERATOR) {
                    let { q } = req.query
                    let query = <string>q || ""
                    let users = await UserService.find({ $text: { $search: query } })
                    res.status(200).send({ users })
                } else {
                    res.status(401).send()
                }
            }
        },
    } as IController as { [k: string]: { [k: string]: RequestHandler } })