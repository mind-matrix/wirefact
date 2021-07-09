import uniqid from "uniqid"
import { Document, model, Schema } from "mongoose";
import { IUserDocument } from "./user.model";

export interface IPasswordResetDocument extends Document {
    code: string
    user: IUserDocument
}

export const PasswordResetSchema = new Schema<IPasswordResetDocument>({
    code: {
        type: String,
        required: true,
        default: () => uniqid()
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    }
})

export const PasswordResetModel = model<IPasswordResetDocument>("PasswordReset", PasswordResetSchema)
