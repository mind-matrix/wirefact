import { RequestHandler } from "express";
import _ from "lodash";
import slugify from "slugify";
import { UserRole } from "../model/user.model";
import { BadgeService } from "../service/badge.service";
import { MediaService } from "../service/media.service";
import { IPost, PostService } from "../service/post.service";
import { TwitterService } from "../service/twitter.service";
import { UrlShortenerService } from "../service/url.shortener.service";
import { UserService } from "../service/user.service";
import { IController } from "./icontroller";
import { UserController } from "./user.controller";
import uniqid from "uniqid";

export async function prepareTextForTweet(post: IPost) {
    let text = `${ post.excerpt?.trim() || `Check out this new post by ${post.author.name}` }`
    let shortLink = await UrlShortenerService.shorten(`https://wirefact.com/post/${post.id}`)
    text += `\n${shortLink}\n`
    
    if (post.hashtags.length) {
        for (let hashtag of post.hashtags) {
            if (text.length + (hashtag.trim().length + 1) < 280) text += ' ' + hashtag.trim()
        }
    }
    return text
}

export const MemberController = _.merge(
    _.cloneDeep(UserController),
{
    badge: {
        async get(req, res, next) {
            if (req.context && req.context.username && req.context.role >= UserRole.MEMBER) {
                let { badgeId } = req.params
                if (badgeId) {
                    let badge = await BadgeService.findOne({ _id: badgeId })
                    if (!badge) res.status(404).send()
                    else res.status(200).send({ badge })
                } else {
                    res.status(400).send()
                }
            } else {
                res.status(401).send()
            }
        }
    },

    badges: {
        async get(req, res, next) {
            if (req.context && req.context.username && req.context.role >= UserRole.MEMBER) {
                let badges = await BadgeService.find({})
                res.status(200).send({ badges })
            } else {
                res.status(401).send()
            }
        }
    },

    draft: {
        async get(req, res, next) {
            if (req.context && req.context.username && req.context.role >= UserRole.MEMBER) {
                let { postId } = req.params
                let author = await UserService.findOne({ username: <string>req.context.username })
                if (author && postId) {
                    let draft = await PostService.findOne({ _id: postId, draft: true, author: <any>author.id })
                    if (draft) res.status(200).send({ draft })
                    else res.status(404).send()
                }  else {
                    res.status(404).send()
                }
            } else {
                res.status(401).send()
            }
        }
    },

    drafts: {
        async get(req, res, next) {
            let filters = req.query as { [k: string]: string }
            let skip = filters.skip ? parseInt(filters.skip) : 0
            let limit = filters.limit ? Math.min(15, parseInt(filters.limit)) : 15
            let projection = filters.content ? null : '-content'
            if (req.context && req.context.username && req.context.role >= UserRole.MEMBER) {
                let author = await UserService.findOne({ username: <string>req.context.username })
                if (author) {
                    let drafts = await PostService.find({ draft: true, author: <any>author.id }, { skip, limit, sort: '-createdAt' }, projection)
                    res.status(200).send({ drafts })
                }  else {
                    res.status(404).send()
                }
            } else {
                res.status(401).send()
            }
        }
    },

    countDrafts: {
        async get(req, res, next) {
            if (req.context && req.context.username && req.context.role >= UserRole.MEMBER) {
                let user = await UserService.findOne({ username: <string>req.context.username })
                if (user) {
                    let count = await PostService.count({ author: <any>user.id, draft: true })
                    res.status(200).send({ count })
                } else {
                    res.status(404).send()
                }
            } else {
                res.status(401).send()
            }
        }
    },
    
    post: {

        async post(req, res, next) {
            if (req.context && req.context.username && req.context.role >= UserRole.MEMBER) {
                let author = await UserService.findOne({ username: <string>req.context.username })
                if (author) {
                    let data = <any>_.pick(req.body, ["cover","title","slug","excerpt","content","topics","hashtags","sources","draft"])
                    data.author = author.id
                    if (!data.slug) data.slug = slugify(data.title, { lower: true })
                    if (await PostService.exists({ slug: data.slug })) data.slug = `${data.slug}-${uniqid()}`
                    let post = await PostService.create(data)
                    
                    // Direct Tweet
                    const text = await prepareTextForTweet(post)
                    const media = Buffer.from(<any>(await MediaService.download(post.cover.key)).Body, <any>post.cover.filetype)

                    TwitterService.tweet({ text, media })
                    
                    res.status(200).send({ post })
                } else {
                    res.status(404).send()
                }
            } else {
                res.status(401).send()
            }
        },

        async put(req, res, next) {
            if (req.context && req.context.username && req.context.role >= UserRole.MEMBER) {
                let author = await UserService.findOne({ username: <string>req.context.username })
                if (author) {
                    let { postId } = req.params
                    let data = <any>_.pick(req.body, ["cover","title","slug","excerpt","content","topics","hashtags","sources","draft"])
                    let post = await PostService.updateOne({ _id: postId, author: <any>author.id }, data)
                    if (!post) res.status(404).send()
                    else res.status(200).send({ post })
                } else {
                    res.status(500).send()
                }
            } else {
                res.status(401).send()
            }
        },

        async delete(req, res, next) {
            if (req.context && req.context.username && req.context.role >= UserRole.MEMBER) {
                let author = await UserService.findOne({ username: <string>req.context.username })
                if (author) {
                    let { postId } = req.params
                    let post = await PostService.deleteOne({ _id: postId, author: <any>author.id })
                    if (post) {
                        if (post.narration) {
                            await MediaService.delete(post.narration.male)
                            await MediaService.delete(post.narration.female)
                        }
                        res.status(200).send({ post })
                    } else {
                        res.status(404).send()
                    }
                } else {
                    res.status(500).send()
                }
            } else {
                res.status(401).send()
            }
        }
    },

    postExists: {
        async post(req, res, next) {
            let data = <any>_.pick(req.body, ["id","slug","title"])
            if (data.id || data.slug || data.title) {
                let exists = await PostService.exists(data)
                res.status(200).send({ exists })
            } else {
                res.status(400).send()
            }
        }
    },

    publishedPost: {
        async get(req, res, next) {
            if (req.context && req.context.username && req.context.role >= UserRole.MEMBER) {
                let { postId } = req.params
                let author = await UserService.findOne({ username: <string>req.context.username })
                if (author && postId) {
                    let post = await PostService.findOne({ _id: postId, draft: false, author: <any>author.id })
                    if (post) res.status(200).send({ post })
                    else res.status(404).send()
                }  else {
                    res.status(404).send()
                }
            } else {
                res.status(401).send()
            }
        }
    },

    publishedPosts: {
        async get(req, res, next) {
            let filters = req.query as { [k: string]: string }
            let skip = filters.skip ? parseInt(filters.skip) : 0
            let limit = filters.limit ? Math.min(15, parseInt(filters.limit)) : 15
            let projection = filters.content ? null : '-content'
            if (req.context && req.context.username && req.context.role >= UserRole.MEMBER) {
                let author = await UserService.findOne({ username: <string>req.context.username })
                if (author) {
                    let posts = await PostService.find({ draft: false, author: <any>author.id }, { skip, limit, sort: '-createdAt' }, projection)
                    res.status(200).send({ posts })
                }  else {
                    res.status(404).send()
                }
            } else {
                res.status(401).send()
            }
        }
    },

    countPublishedPosts: {
        async get(req, res, next) {
            if (req.context && req.context.username && req.context.role >= UserRole.MEMBER) {
                let user = await UserService.findOne({ username: <string>req.context.username })
                if (user) {
                    let count = await PostService.count({ author: <any>user.id, draft: false })
                    res.status(200).send({ count })
                } else {
                    res.status(404).send()
                }
            } else {
                res.status(401).send()
            }
        }
    },

    signMedia: {

        async post(req, res, next) {
            if (req.context && req.context.username && req.context.role >= UserRole.MEMBER) {
                let request = _.pick(req.body, ["filename","filetype"])
                let response = await MediaService.signRequest(request)
                res.status(200).send(response)
            } else {
                res.status(401).send()
            }
        }
    },

    media: {

        async post(req, res, next) {
            if (req.context && req.context.username && req.context.role >= UserRole.MEMBER) {
                let owner = await UserService.findOne({ username: <string>req.context.username })
                if (owner) {
                    let data = <any>_.pick(req.body, ["key","filesize","filename","filetype","metadata"])
                    data.owner = owner.id
                    let usage = await MediaService.usage({ owner: <any>owner.id })
                    if (usage.remaining < data.filesize) {
                        res.status(403).send()
                    } else {
                        let media = await MediaService.create(data)
                        res.status(200).send({ media })
                    }
                } else {
                    res.status(404).send()
                }
            } else {
                res.status(401).send()
            }
        },
    
        async put(req, res, next) {
            if (req.context && req.context.username && req.context.role >= UserRole.MEMBER) {
                let { mediaId } = req.params
                let data = <any>_.pick(req.body, ["filename","metadata"])
                let owner = await MediaService.findOne({ username: req.context.username })
                if (owner) {
                    let media = await MediaService.updateOne({ _id: mediaId, owner: <any>owner.id }, data)
                    if (!media) res.status(404).send()
                    else res.status(200).send({ media })
                } else {
                    res.status(404).send()
                }
            } else {
                res.status(401).send()
            }
        },

        async delete(req, res, next) {
            if (req.context && req.context.username && req.context.role >= UserRole.MEMBER) {
                let { mediaId } = req.params
                let owner = await MediaService.findOne({ username: req.context.username })
                if (owner) {
                    let media = await MediaService.deleteOne({ _id: mediaId, owner: <any>owner.id })
                    if (!media) res.status(404).send()
                    else {
                        await MediaService.delete(media.key)
                        res.status(200).send({ media })
                    }
                } else {
                    res.status(404).send()
                }
            } else {
                res.status(401).send()
            }
        }
    },

    medias: {
        
        async get(req, res, next) {
            let filters = req.query as { [k: string]: string }
            let skip = filters.skip ? parseInt(filters.skip) : 0
            let limit = filters.limit ? Math.min(15, parseInt(filters.limit)) : 15
            if (req.context && req.context.username && req.context.role >= UserRole.MEMBER) {
                let owner = await UserService.findOne({ username: <string>req.context.username })
                if (owner) {
                    let medias = await MediaService.find({ owner: <any>owner.id }, { skip, limit, sort: '-createdAt' })
                    res.status(200).send({ medias })
                } else {
                    res.status(404).send()
                }
            } else {
                res.status(401).send()
            }
        }
    },

    countMedias: {
        async get(req, res, next) {
            if (req.context && req.context.username && req.context.role >= UserRole.MEMBER) {
                let owner = await UserService.findOne({ username: <string>req.context.username })
                if (owner) {
                    let count = await MediaService.count({ owner: <any>owner.id })
                    res.status(200).send({ count })
                } else {
                    res.status(404).send()
                }
            } else {
                res.status(401).send()
            }
        }
    },

    mediaUsage: {
        
        async get(req, res, next) {
            if (req.context && req.context.username && req.context.role >= UserRole.MEMBER) {
                let owner = await UserService.findOne({ username: <string>req.context.username })
                if (owner) {
                    let usage = await MediaService.usage({ owner: <any>owner.id })
                    res.status(200).send({ usage })
                } else {
                    res.status(404).send()
                }
            } else {
                res.status(401).send()
            }
        }
    }
} as IController as { [k: string]: { [k: string]: RequestHandler } })