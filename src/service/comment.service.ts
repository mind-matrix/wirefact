import _ from "lodash";
import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { ICommentDocument, CommentModel } from "../model/comment.model";
import { IUser, UserService } from "./user.service";

export interface IComment {
    id: string
    author: IUser
    postId: string
    content: object
    mentions: IUser[]
    sentiment: number
}

export class CommentService {

    static async sanitize(comment: ICommentDocument): Promise<IComment>
    static async sanitize(comment: ICommentDocument[]): Promise<IComment[]>
    static async sanitize(comment: null): Promise<null>
    static async sanitize(comment: ICommentDocument | ICommentDocument[] | null) {
        const fields = ["id","author","postId","content","mentions","sentiment","createdAt","updatedAt"]
        if (!comment) return null
        if (Array.isArray(comment)) return Promise.all(comment.map(async p => {
            return { ..._.pick(p.toJSON({ virtuals: true }), fields), author: await UserService.sanitize(p.author), mentions: await UserService.sanitize(p.mentions) }
        }))
        return { ..._.pick(comment.toJSON({ virtuals: true }), fields), author: await UserService.sanitize(comment.author), mentions: await UserService.sanitize(comment.mentions) }
    }

    static async create(data: any) {
        let comment = new CommentModel(data)
        let err = comment.validateSync()
        if (err) throw Error(`invalid comment document`)
        await comment.save()
        return await this.sanitize(comment)
    }

    static async findOne(filters: FilterQuery<ICommentDocument> = {}, options: QueryOptions = {}) {
        let comment = await CommentModel.findOne(filters, null, options).populate("author").populate("mentions")
        if (!comment) return null
        return await this.sanitize(comment)
    }

    static async find(filters: FilterQuery<ICommentDocument> = {}, options: QueryOptions = {}) {
        let comment = await CommentModel.find(filters, null, options).populate("author").populate("mentions")
        return await this.sanitize(comment)
    }

    static async count(filters: FilterQuery<ICommentDocument> = {}) {
        let count = await CommentModel.count(filters)
        return count
    }

    static async updateOne(filters: FilterQuery<ICommentDocument> = {}, updates: UpdateQuery<ICommentDocument>) {
        let comment = await CommentModel.findOneAndUpdate(filters, updates, { new: true }).populate("author").populate("mentions")
        if (!comment) return null
        return await this.sanitize(comment)
    }

    static async deleteOne(filters: FilterQuery<ICommentDocument> = {}) {
        let post = await CommentModel.findOne(filters)
        if (!post) return null
        await post.remove()
        return await this.sanitize(post)
    }
}
