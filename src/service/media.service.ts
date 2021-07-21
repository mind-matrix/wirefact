import _ from "lodash";
import { FilterQuery, QueryOptions } from "mongoose";
import { IMediaDocument, MediaModel } from "../model/media.model";
import { IUser, UserService } from "./user.service";
import AWS from "aws-sdk";
import uniqid from "uniqid";

AWS.config.update({
    region: 'ap-south-1',
    signatureVersion: 'v4'
})

export interface IMedia {
    id: string
    key: string
    filesize: number
    filename: string
    filetype: string
    encoding: string
    metadata?: object
    owner: IUser
}

export class MediaService {

    static async sanitize(media: IMediaDocument): Promise<IMedia>
    static async sanitize(media: IMediaDocument[]): Promise<IMedia[]>
    static async sanitize(media: null): Promise<null>
    static async sanitize(media: IMediaDocument | IMediaDocument[] | null) {
        const fields = ["id","key","filesize","filename","filetype","encoding","metadata"]
        if (!media) return null
        if (Array.isArray(media)) return Promise.all(media.map(async m => {
            return { ..._.pick(m.toJSON({ virtuals: true }), fields), owner: await UserService.sanitize(m.owner) }
        }))
        return { ..._.pick(media.toJSON({ virtuals: true }), fields), owner: await UserService.sanitize(media.owner) }
    }

    static signRequest(request: { filename: string, filetype: string }) {
        const s3 = new AWS.S3()
        const key = `${uniqid()}_${request.filename}`
        let signedRequest = s3.getSignedUrl("putObject", {
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: key,
            Expires: 60,
            ContentType: request.filetype,
            ACL: "public-read"
        })
        return { signedRequest, key, url: `https://${process.env.AWS_S3_BUCKET!}.s3.ap-south-1.amazonaws.com/${key}` }
    }

    static async upload(key: string, body: Buffer, contentType: string, isPublic: boolean=true) {
        const s3 = new AWS.S3()
        await s3.putObject({
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: key,
            Body: body,
            ContentType: contentType,
            ACL: isPublic ? "public-read" : undefined
        }).promise()
    }

    static async download(key: string) {
        const s3 = new AWS.S3()
        return await s3.getObject({
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: key
        }).promise()
    }

    static async delete(key: string) {
        const s3 = new AWS.S3()
        await s3.deleteObject({
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: key
        })
    }

    static async usage(filters: FilterQuery<IMediaDocument>) {
        let medias = await MediaModel.find(filters)
        let available = parseInt(process.env.DRIVE_SPACE!)
        let used = medias.map(media => media.filesize).reduce((a,v) => a+v, 0)
        let remaining = available - used
        return {
            available,
            used,
            remaining
        }
    }

    static async create(data: any) {
        try {
            const s3 = new AWS.S3()
            await s3.headObject({ Bucket: process.env.AWS_S3_BUCKET!, Key: data.key }).promise()
            let media = new MediaModel(data)
            let err = media.validateSync()
            if (err) throw Error(`invalid media document`)
            await media.save()
            media = await media.populate("owner").execPopulate()
            return await this.sanitize(media)
        } catch (err) {
            throw Error("invalid object details")
        }
    }

    static async findOne(filters: FilterQuery<IMediaDocument> = {}, options: QueryOptions = {}) {
        let media = await MediaModel.findOne(filters, null, options).populate("owner")
        if (!media) return null
        return await this.sanitize(media)
    }

    static async find(filters: FilterQuery<IMediaDocument> = {}, options: QueryOptions = {}) {
        let media = await MediaModel.find(filters, null, options).populate("owner")
        return await this.sanitize(media)
    }

    static async count(filters: FilterQuery<IMediaDocument> = {}) {
        let count = await MediaModel.count(filters)
        return count
    }

    static async updateOne(filters: FilterQuery<IMediaDocument> = {}, updates: any) {
        let media = await MediaModel.findOneAndUpdate(filters, updates, { new: true }).populate("owner")
        if (!media) return null
        return await this.sanitize(media)
    }

    static async deleteOne(filters: FilterQuery<IMediaDocument> = {}) {
        let media = await MediaModel.findOne(filters)
        if (!media) return null
        await this.delete(media.key)
        await media.remove()
        return await this.sanitize(media)
    }
}
