import { IController } from "./icontroller";
import jwt from "jsonwebtoken";
import { UserRole } from "../model/user.model";
import { UserService } from "../service/user.service";
import { CommentService } from "../service/comment.service";
import { RequestHandler } from "express";
import { PostService } from "../service/post.service";
import { Statics } from "../service/_static.service";
import { MediaService } from "../service/media.service";
import _ from "lodash";
import { InvitationService } from "../service/invitation.service";
import { MailService } from "../service/mail.service";
import { uniqueNamesGenerator, animals, colors, adjectives } from "unique-names-generator";
import { parsePhoneNumber } from "libphonenumber-js";

export const UserController = {
    invitation: {
        async get(req, res, next) {
            let { code } = req.params
            if (code) {
                let invitation = await InvitationService.findOne({ code })
                if (invitation) {
                    res.status(200).send({ invitation })
                } else {
                    res.status(404).send()
                }
            } else {
                res.status(400).send()
            }
        },
        async put(req, res, next) {
            let { code } = req.params
            if (code) {
                let { password } = req.body
                if (password) {
                    let invitation = await InvitationService.findOne({ code })
                    if (invitation) {
                        let user = await UserService.create({
                            username: invitation.username,
                            name: invitation.name,
                            email: invitation.email,
                            password: password,
                            badges: invitation.badges,
                            role: invitation.role
                        })
                        await InvitationService.deleteOne({ code: invitation.code })
                        res.status(200).send()
                    } else {
                        res.status(404).send()
                    }
                } else {
                    res.status(400).send()
                }
            } else {
                res.status(400).send()
            }
        }
    },
    resetPassword: {
        async get(req, res, next) {
            let { identifier } = req.params
            if (identifier) {
                let { code, user } = await UserService.createPasswordRequest({ $or: [{ username: identifier },{ email: identifier }] })
                if (code && user) {
                    MailService.sendTemplated(user.email, "resetpwd", { name: user.name, code })
                    res.status(200).send()
                } else {
                    res.status(500).send()
                }
            } else {
                res.status(400).send()
            }
        },
        async post(req, res, next) {
            let { code, password } = req.body
            if (code && password) {
                await UserService.resetPassword(code, password)
                res.status(200).send()
            } else {
                res.status(400).send()
            }
        }
    },
    register: {
        async post(req, res, next) {
            let data = <any>_.pick(req.body, ["username","name","email","phone","password"])
            if (!data.username) {
                data.username = uniqueNamesGenerator({
                    dictionaries: [colors, adjectives, animals],
                    style: 'lowerCase'
                })
            }
            if (data.phone) {
                let phoneNumber = parsePhoneNumber(data.phone, "IN")
                if (!phoneNumber.isValid()) throw new Error(`invalid phone number`)
                data.phone = phoneNumber.number
            }
            let invitation = await InvitationService.findOne({ email: data.email })
            if (invitation) {
                data.role = invitation.role
                await InvitationService.deleteOne({ email: data.email })
            }
            let user = await UserService.create(data)
            res.status(200).send({ user })
        }
    },
    login: {
        async post(req, res, next) {
            let { identifier, password } = req.body
            if (identifier && password) {
                let { isValid, user } = await UserService.validate(identifier, password)
                if (isValid && user) {
                    let payload = { username: user.username, role: user.role }
                    let token = jwt.sign(payload, process.env.JWT_SECRET!)
                    res.status(200).send({ user, token })
                } else {
                    res.status(401).send()
                }
            } else {
                res.status(400).send()
            }
        }
    },
    auth: {
        all(req, res, next) {
            let token = req.headers["authorization"] || req.headers["Authorization"] || null
            if (!token) req.context = {}
            else {
                let payload = <{ username: string, role: UserRole }>jwt.verify(<string>token, process.env.JWT_SECRET!)
                req.context = payload
            }
            next()
        }
    },
    profileExists: {
        async post(req, res, next) {
            let data = <any>_.pick(req.body, ["username","email","phone"])
            if (data.username || data.email || data.phone) {
                let exists = await UserService.exists(data)
                res.status(200).send({ exists })
            } else {
                res.status(400).send()
            }
        }
    },
    profile: {
        async get(req, res, next) {
            let { username } = req.params
            if (username) {
                let user = await UserService.findOne({ username })
                if (!user) res.status(404).send()
                else {
                    if (!user.privacy?.emailPublic) delete user.email
                    if (!user.privacy?.phonePublic) delete user.phone
                    delete user.privacy
                    res.status(200).send({ user })
                }
            } else {
                let { username, role } = req.context as { [k: string]: string | number, username: string, role: UserRole }
                if (username) {
                    let user = await UserService.findOne({ username, role })
                    if (!user) res.status(404).send()
                    else res.status(200).send({ user })
                } else {
                    res.status(401).send()
                }
            }
        },
    
        async put(req, res, next) {
            let updates = <any>_.pick(req.body, ["name","phone","privacy"])
            let { username, role } = req.context as { [k: string]: string | number, username: string, role: UserRole }
            if (username) {
                if (updates.phone) {
                    let phoneNumber = parsePhoneNumber(updates.phone, "IN")
                    if (!phoneNumber.isValid()) return res.status(400).send("Invalid phone number")
                    updates.phone = phoneNumber.number
                }
                let user = await UserService.updateOne({ username }, updates)
                if (!user) res.status(400).send()
                else res.status(200).send({ user })
            } else {
                res.status(401).send()
            }
        }
    },

    post: {
        async get(req, res, next) {
            let { postId } = req.params
            if (postId) {
                let post
                if (postId.match(/^[0-9a-fA-F]{24}$/)) {
                    post = await PostService.findOne({ $or: [{ _id: postId }, { slug: postId }], draft: false })
                } else {
                    post = await PostService.findOne({ slug: postId, draft: false })
                }
                if (post) {
                    // register view
                    if (req.context && req.context.username) {
                        let username = <string>req.context.username
                        let views = await PostService.addView({ _id: post.id }, { username })
                        if (views) {
                            post.metrics.views = views
                        }
                    } else if (req.query.token && req.query.token === process.env.APP_TOKEN) {
                        // ignore
                    } else {
                        let ip = <string>req.headers['client-fingerprint']
                        if (ip) {
                            let views = await PostService.addView({ _id: post.id }, { ip })
                            if (views) {
                                post.metrics.views = views
                            }
                        }
                    }
                    res.status(200).send({ post })
                } else {
                    res.status(404).send()
                }
            } else {
                res.status(400).send()
            }
        }
    },
    posts: {
        async get(req, res, next) {
            let filters = req.query as { [k: string]: string }
            let skip = filters.skip ? parseInt(filters.skip) : 0
            let limit = filters.limit ? Math.min(15, parseInt(filters.limit)) : 15
            let projection = filters.content ? null : '-content'
            if (req.context && req.context.username) {
                // TODO: registered user (sort & return by post preferences)
                let posts = await PostService.find({ draft: false }, { skip, limit, sort: '-createdAt' }, projection)
                res.status(200).send({ posts })
            } else {
                // un-registered user (sort & return by date)
                let posts = await PostService.find({ draft: false }, { skip, limit, sort: '-createdAt' }, projection)
                res.status(200).send({ posts })
            }
        }
    },
    countPosts: {
        async get(req, res, next) {
            let { username } = req.params
            if (username) {
                let user = await UserService.findOne({ username })
                if (user) {
                    let count = await PostService.count({ author: <any>user.id, draft: false })
                    res.status(200).send({ count })
                } else {
                    res.status(404).send()
                }
            } else if (req.context && req.context.username) {
                let user = await UserService.findOne({ username: <string>req.context.username })
                if (user) {
                    let count = await PostService.count({ author: <any>user.id, draft: false })
                    res.status(200).send({ count })
                } else {
                    res.status(404).send()
                }
            } else if (req.query.token && req.query.token === process.env.APP_TOKEN) {
                let count = await PostService.count({ draft: false })
                res.status(200).send({ count })
            } else {
                res.status(400).send()
            }
        }
    },
    searchPosts: {
        async get(req, res, next) {
            let filters = req.query as { [k: string]: string }
            let query = filters.q
            let skip = filters.skip ? parseInt(filters.skip) : 0
            let limit = filters.limit ? Math.min(15, parseInt(filters.limit)) : 15
            let projection = filters.content ? null : '-content'
            if (query) {
                let posts = await PostService.find({ $text: { $search: query } }, { skip, limit, sort: '-createdAt' }, projection)
                res.status(200).send({ posts })
            } else {
                res.status(400).send()
            }
        }
    },
    narrations: {
        async get(req, res, next) {
            let filters = req.query as { [k: string]: string }
            let skip = filters.skip ? parseInt(filters.skip) : 0
            let limit = filters.limit ? Math.min(15, parseInt(filters.limit)) : 15
            let projection = filters.content ? null : '-content'
            if (req.context && req.context.username) {
                // TODO: registered user (sort & return by post preferences)
                let posts = await PostService.find({ "narration.male": { $exists: true }, "narration.female": { $exists: true }, draft: false }, { skip, limit, sort: '-createdAt' }, projection)
                res.status(200).send({ posts })
            } else {
                // un-registered user (sort & return by date)
                let posts = await PostService.find({ "narration.male": { $exists: true }, "narration.female": { $exists: true }, draft: false }, { skip, limit, sort: '-createdAt' }, projection)
                res.status(200).send({ posts })
            }
        }
    },
    comment: {
        async get(req, res, next) {
            let { id, postId } = req.query as { [k: string]: any, id?: string, postId?: string }
            if (id) {
                let comment = await CommentService.findOne({ _id: id })
                res.status(200).send({ comment })
            } else if (postId) {
                let filters = req.query as { [k: string]: string }
                let skip = filters.skip ? parseInt(filters.skip) : 0
                let limit = filters.limit ? Math.min(15, parseInt(filters.limit)) : 15
                let comments = await CommentService.find({ postId }, { skip, limit, sort: '-createdAt' })
                res.status(200).send({ comments })
            } else {
                res.status(400).send()
            }
        },
        async post(req, res, next) {
            if (req.context && req.context.username) {
                let user = await UserService.findOne({ username: <string>req.context.username })
                if (user) {
                    let data = <any>_.pick(req.body, ["postId","content","mentions"])
                    data.author = user.id
                    let comment = await CommentService.create(data)
                    res.status(200).send({ comment })
                } else {
                    res.status(404).send()
                }
            } else {
                res.status(401).send()
            }
        },
        async put(req, res, next) {
            if (req.context && req.context.username) {
                let user = await UserService.findOne({ username: <string>req.context.username })
                if (user) {
                    let { commentId } = req.params
                    if (commentId) {
                        let data = <any>_.pick(req.body, ["content","mentions"])
                        let comment = await CommentService.updateOne({ _id: commentId, author: <any>user.id }, data)
                        if (!comment) res.status(404).send()
                        else res.status(200).send({ comment })
                    } else {
                        res.status(400).send()
                    }
                } else {
                    res.status(404).send()
                }
            } else {
                res.status(401).send()
            }
        },
        async delete(req, res, next) {
            if (req.context && req.context.username) {
                let user = await UserService.findOne({ username: <string>req.context.username })
                if (user) {
                    let { commentId } = req.params
                    if (commentId) {
                        let comment = await CommentService.deleteOne({ _id: commentId, author: <any>user.id })
                        if (!comment) res.status(404).send()
                        else res.status(200).send({ comment })
                    } else {
                        res.status(400).send()
                    }
                } else {
                    res.status(404).send()
                }
            } else {
                res.status(401).send()
            }
        }
    },

    media: {

        async get(req, res, next) {
            let { mediaId } = req.params
            let media = await MediaService.findOne({ _id: mediaId })
            if (media) {
                res.status(200).send({ media })
            } else {
                res.status(404).send()
            }
        }
    },
    _statics: {
        async get(req, res, next) {
            let statics = await Statics.get()
            res.status(200).send(statics)
        }
    }
} as IController as { [k: string]: { [k: string]: RequestHandler } }
