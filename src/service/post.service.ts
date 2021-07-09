import { BloomFilter } from "bloomfilter";
import _ from "lodash";
import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { IPostDocument, PostModel } from "../model/post.model";
import { IMedia, MediaService } from "./media.service";
import { IUser, UserService } from "./user.service";

export interface IPost {
    id: string
    cover: IMedia
    title: string
    author: IUser
    slug: string
    excerpt?: string
    content: object
    topics: string[]
    hashtags: string[]
    contributors: IUser[]
    sources: string[]
    narration?: {
        male: string
        female: string
    }
    draft: boolean
    metrics: {
        views: {
            verified: {
                count: number
            }
            unverified: {
                count: number
            }
        }
    }
}

export class PostService {

    static async sanitize(post: IPostDocument): Promise<IPost>
    static async sanitize(post: IPostDocument[]): Promise<IPost[]>
    static async sanitize(post: null): Promise<null>
    static async sanitize(post: IPostDocument | IPostDocument[] | null): Promise<IPost | IPost[] | null> {
        const fields = ["id","cover","title","author","slug","excerpt","content","topics","hashtags","contributors","sources","narration","draft","metrics.views.verified.count","metrics.views.unverified.count","createdAt","updatedAt"]
        const mediaFields = ["id","key","filename","filetype","filesize","metadata"]
        if (!post) return null
        if (Array.isArray(post)) return <IPost[]><unknown>Promise.all(post.map(async p => {
            return { ..._.pick(p.toJSON({ virtuals: true }), fields), cover: _.pick(await MediaService.sanitize(p.cover), mediaFields), author: await UserService.sanitize(p.author), contributors: await UserService.sanitize(p.contributors) }
        }))
        return <IPost><unknown>{ ..._.pick(post.toJSON({ virtuals: true }), fields), cover: _.pick(await MediaService.sanitize(post.cover), mediaFields), author: await UserService.sanitize(post.author), contributors: await UserService.sanitize(post.contributors) }
    }

    static async create(data: any) {
        let post = new PostModel(data)
        let err = post.validateSync()
        if (err) throw Error(`invalid post document`)
        await post.save()
        post = await post.populate("cover").populate("author").populate("contributors").execPopulate()
        return await this.sanitize(post)
    }

    static async findOne(filters: FilterQuery<IPostDocument> = {}, options: QueryOptions = {}, projection: string | null = null) {
        let post = await PostModel.findOne(filters, projection, options).populate("cover").populate("author").populate("contributors")
        if (!post) return null
        return await this.sanitize(post)
    }

    static async find(filters: FilterQuery<IPostDocument> = {}, options: QueryOptions = {}, projection: string | null = null) {
        let post = await PostModel.find(filters, projection, options).populate("cover").populate("author").populate("contributors")
        return await this.sanitize(post)
    }

    static async count(filters: FilterQuery<IPostDocument> = {}) {
        let count = await PostModel.count(filters)
        return count
    }

    static async updateOne(filters: FilterQuery<IPostDocument> = {}, updates: UpdateQuery<IPostDocument>) {
        let post = await PostModel.findOneAndUpdate(filters, updates, { new: true }).populate("cover").populate("author").populate("contributors")
        if (!post) return null
        return await this.sanitize(post)
    }

    static async deleteOne(filters: FilterQuery<IPostDocument> = {}) {
        let post = await PostModel.findOne(filters).populate("cover").populate("author").populate("contributors")
        if (!post) return null
        await post.remove()
        return await this.sanitize(post)
    }

    static async addView(filters: FilterQuery<IPostDocument> = {}, identification: Partial<{ ip: string, username: string }>) {
        let post = await PostModel.findOne(filters)
        if (!post) return null
        if (identification.ip) {
            let bloom = new BloomFilter(post.metrics.views.unverified.bloomBuckets, 8)
            if (!bloom.test(identification.ip)) {
                bloom.add(identification.ip)
                post.metrics.views.unverified.bloomBuckets = [].slice.call(bloom.buckets)
                post.metrics.views.unverified.count += 1
            }
        } else if (identification.username) {
            let bloom = new BloomFilter(post.metrics.views.verified.bloomBuckets, 8)
            if (!bloom.test(identification.username)) {
                bloom.add(identification.username)
                post.metrics.views.verified.bloomBuckets = [].slice.call(bloom.buckets)
                post.metrics.views.verified.count += 1
            }
        }
        await post.save()
        return <{ verified:{ count: number }, unverified:{ count: number } }>_.pick(post.metrics.views, ["verified.count","unverified.count"])
    }
}
