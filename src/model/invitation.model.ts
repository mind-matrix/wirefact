import { Document, Schema, model } from "mongoose";
import { IBadgeDocument } from "./badge.model";
import { UserRole } from "./user.model";
import uniqid from "uniqid";

export interface IInvitationDocument extends Document {
    code: string
    username: string
    name: string
    email: string
    phone?: string
    badges: IBadgeDocument[]
    role: UserRole
}

export const InvitationSchema = new Schema<IInvitationDocument>({
    code: {
        type: String,
        required: true,
        default: () => uniqid(),
        unique: true,
        index: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    phone: {
        type: String,
        unique: true
    },
    badges: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Badge"
        }],
        default: []
    },
    role: {
        type: Number,
        default: UserRole.USER
    }
})

export const InvitationModel = model<IInvitationDocument>("Invitation", InvitationSchema)
