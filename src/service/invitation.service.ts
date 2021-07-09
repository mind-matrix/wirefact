import _ from "lodash"
import { FilterQuery, QueryOptions } from "mongoose"
import { IInvitationDocument, InvitationModel } from "../model/invitation.model"
import { UserRole } from "../model/user.model"
import { BadgeService, IBadge } from "./badge.service"

export interface IInvitation {
    code: string
    username: string
    name: string
    email: string
    gravatar: string
    phone: string
    role: UserRole
    badges: IBadge[]
}

export class InvitationService {

    static async sanitize(invitation: IInvitationDocument): Promise<IInvitation>
    static async sanitize(invitation: IInvitationDocument[]): Promise<IInvitation[]>
    static async sanitize(invitation: null): Promise<null>
    static async sanitize(invitation: IInvitationDocument | IInvitationDocument[] | null) {
        const fields = ["code","username","name","email","gravatar","phone","role"]
        if (!invitation) return null
        if (Array.isArray(invitation)) return <IInvitation[]><unknown>Promise.all(invitation.map(async i => {
            return { ..._.pick(i.toJSON({ virtuals: true }), fields), badges: await BadgeService.sanitize(i.badges) }
        }))
        return <IInvitation><unknown>{ ..._.pick(invitation.toJSON({ virtuals: true }), fields), badges: await BadgeService.sanitize(invitation.badges) }
    }

    static async create(data: any) {
        let invitation = new InvitationModel(data)
        let err = invitation.validateSync()
        if (err) throw Error(`invalid invitation document`)
        await invitation.save()
        return await this.sanitize(invitation)
    }

    static async findOne(filters: FilterQuery<IInvitationDocument> = {}, options: QueryOptions = {}) {
        let invitation = await InvitationModel.findOne(filters, null, options).populate("badges")
        if (!invitation) return null
        return await this.sanitize(invitation)
    }

    static async deleteOne(filters: FilterQuery<IInvitationDocument> = {}) {
        let invitation = await InvitationModel.findOne(filters).populate("badges")
        if (!invitation) return null
        await invitation.remove()
        return await this.sanitize(invitation)
    }

}