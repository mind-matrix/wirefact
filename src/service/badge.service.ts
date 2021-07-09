import { FilterQuery, QueryOptions } from "mongoose";
import { IBadgeDocument, BadgeModel } from "../model/badge.model";
import _ from "lodash";
import { UserModel } from "../model/user.model";
import { IMedia, MediaService } from "./media.service";

export interface IBadge {
    id: string
    name: string
    image: IMedia
    description: string
    popularity: number
}

export class BadgeService {

    static async sanitize(badge: IBadgeDocument): Promise<IBadge>
    static async sanitize(badge: IBadgeDocument[]): Promise<IBadge[]>
    static async sanitize(badge: null): Promise<null>
    static async sanitize(badge: IBadgeDocument | IBadgeDocument[] | null) {
        const fields = ["id","name","image","description"]
        if (!badge) return null
        let total = await UserModel.estimatedDocumentCount()
        if (Array.isArray(badge)) return <IBadge[]><unknown>Promise.all(badge.map(async b => {
            let active = await UserModel.count({ badges: b.id })
            return { ..._.pick(b.toJSON({ virtuals: true }), fields), media: await MediaService.sanitize(b.image), popularity: (active / total).toFixed(2) }
        }))
        let active = await UserModel.count({ badges: badge.id })
        return <IBadge><unknown>{ ..._.pick(badge.toJSON({ virtuals: true }), fields), media: await MediaService.sanitize(badge.image), popularity: (active / total).toFixed(2) }
    }

    static async create(data: any) {
        let badge = new BadgeModel(data)
        let err = badge.validateSync()
        if (err) throw Error(`invalid badge document`)
        await badge.save()
        badge = await badge.populate("media").execPopulate()
        return await this.sanitize(badge)
    }

    static async findOne(filters: FilterQuery<IBadgeDocument> = {}, options: QueryOptions = {}) {
        let badge = await BadgeModel.findOne(filters, null, options).populate("image")
        if (!badge) return null
        return await this.sanitize(badge)
    }

    static async find(filters: FilterQuery<IBadgeDocument> = {}, options: QueryOptions = {}) {
        let badge = await BadgeModel.find(filters, null, options).populate("image")
        return await this.sanitize(badge)
    }

    static async count(filters: FilterQuery<IBadgeDocument> = {}) {
        let count = await BadgeModel.count(filters)
        return count
    }

    static async updateOne(filters: FilterQuery<IBadgeDocument> = {}, updates: any) {
        let badge = await BadgeModel.findOneAndUpdate(filters, updates, { new: true }).populate("image")
        if (!badge) return null
        return await this.sanitize(badge)
    }
}
