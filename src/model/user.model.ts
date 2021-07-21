import { Document, Schema, model } from "mongoose";
import bcryptjs from "bcryptjs";
import gravatar from "gravatar";
import { IBadgeDocument } from "./badge.model";

export enum UserRole {
    USER = 0,
    MEMBER = 1,
    MODERATOR = 2,
    ADMIN = 3
} 

export interface IUserDocument extends Document {
    username: string
    name: string
    email: string
    phone?: string
    gravatar: string
    password: string
    badges: IBadgeDocument[]
    role: UserRole
    privacy: {
        emailPublic: boolean
        phonePublic: boolean
    }
}

export const UserSchema = new Schema<IUserDocument>({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
        validate: {
            validator: function (value: string) {
                return /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){2,}[a-zA-Z0-9]$/.test(value)
            },
            message: (props: any) => `${props.value} is not a valid username`
        }
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        validate: {
            validator: function (value: string) {
                return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)
            },
            message: (props: any) => `${props.value} is not a valid email address`
        }
    },
    phone: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: true,
        select: false
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
    },
    privacy: {
        emailPublic: {
            type: Boolean,
            default: true
        },
        phonePublic: {
            type: Boolean,
            default: false
        }
    }
})

UserSchema.pre("save", function () {
    if (this.isNew || this.isModified("password")) {
        let salt = bcryptjs.genSaltSync(10)
        this.password = bcryptjs.hashSync(this.password, salt)
    }
})

UserSchema.virtual("gravatar").get(function (this: IUserDocument) {
    return gravatar.url(this.email)
})

UserSchema.index({ name: "text", email: "text", username: "text" })

export const UserModel = model<IUserDocument>("User", UserSchema)
