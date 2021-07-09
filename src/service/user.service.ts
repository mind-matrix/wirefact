import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { IUserDocument, UserModel, UserRole } from "../model/user.model";
import _ from "lodash";
import { BadgeService, IBadge } from "./badge.service";
import bcryptjs from "bcryptjs"
import { PasswordResetModel } from "../model/password-reset.model";
import uniqid from "uniqid";

export interface IUser {
    id: string
    username: string
    name: string
    email?: string
    gravatar: string
    phone?: string
    role: UserRole
    badges: IBadge[]
    privacy?: {
        emailPublic: boolean
        phonePublic: boolean
    }
}

export class UserService {
    static async sanitize(user: IUserDocument): Promise<IUser>
    static async sanitize(user: IUserDocument[]): Promise<IUser[]>
    static async sanitize(user: null): Promise<null>
    static async sanitize(user: IUserDocument | IUserDocument[] | null) {
        const fields = ["id","username","name","email","gravatar","phone","role","privacy"]
        if (!user) return null
        if (Array.isArray(user)) return <IUser[]><unknown>Promise.all(user.map(async u => {
            return { ..._.pick(u.toJSON({ virtuals: true }), fields), badges: await BadgeService.sanitize(u.badges) }
        }))
        return <IUser><unknown>{ ..._.pick(user.toJSON({ virtuals: true }), fields), badges: await BadgeService.sanitize(user.badges) }
    }

    static async create(data: any) {
        let user = new UserModel(data)
        let err = user.validateSync()
        if (err) throw Error(`invalid user document`)
        await user.save()
        return await this.sanitize(user)
    }

    static async validate(identifier: string, password: string) {
        let user = await UserModel.findOne({ $or: [ { username: identifier }, { email: identifier } ] }, '+password')
        if (!user) throw Error(`user not found`)
        let isValid = await bcryptjs.compare(password, user.password)
        return { isValid, user: await this.sanitize(user) }
    }

    static async createPasswordRequest(filters: FilterQuery<IUserDocument> = {}, options: QueryOptions = {}) {
        let user = await UserModel.findOne(filters, null, options)
        if (!user) throw new Error(`user not found`)
        let resetPassword = await PasswordResetModel.findOneAndUpdate({
            user: user.id
        }, { code: uniqid() }, { new: true, upsert: true }).populate("user")
        await resetPassword.save()
        return _.pick(resetPassword, ["code","user"])
    }

    static async resetPassword(code: string, password: string) {
        let resetPassword = await PasswordResetModel.findOne({ code })
        if (!resetPassword) throw new Error(`no password reset requests found`)
        let user = await UserModel.findOne({ _id: resetPassword.user })
        if (!user) throw new Error(`user not found`)
        user.password = password
        await user.save()
        await resetPassword.remove()
        return await this.sanitize(user)
    }

    static async findOne(filters: FilterQuery<IUserDocument> = {}, options: QueryOptions = {}) {
        let user = await UserModel.findOne(filters, null, options).populate("badges")
        if (!user) return null
        return await this.sanitize(user)
    }

    static async find(filters: FilterQuery<IUserDocument> = {}, options: QueryOptions = {}) {
        let user = await UserModel.find(filters, null, options).populate("badges")
        return await this.sanitize(user)
    }

    static async exists(filters: FilterQuery<IUserDocument> = {}) {
        let exists = await UserModel.exists(filters)
        return exists
    }

    static async count(filters: FilterQuery<IUserDocument> = {}) {
        let count = await UserModel.count(filters)
        return count
    }

    static async updateOne(filters: FilterQuery<IUserDocument> = {}, updates: UpdateQuery<IUserDocument>) {
        let user = await UserModel.findOneAndUpdate(filters, updates, { new: true }).populate("badges")
        if (!user) return null
        return await this.sanitize(user)
    }
}