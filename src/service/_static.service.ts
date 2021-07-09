import _ from "lodash";
import { IStaticDocument, StaticModel } from "../model/_static.model";

export interface IStatic {
    config: { [k: string]: string | number }
    announcements: [{
        title: string
        tags: string[]
        content: string
        expiresAt: Date
    }]
}

export const DEFAULT_STATICS = {
    config: {},
    announcements: []
}

export class Statics {

    static async sanitize(statics: IStaticDocument | null) {
        const fields = ["config","announcements"]
        if (!statics) return DEFAULT_STATICS
        return _.pick(statics, fields)
    }

    static async update(data: any) {
        if (await StaticModel.exists({})) {
            let statics = await StaticModel.findOneAndUpdate({}, data, { new: true })
            return statics
        } else {
            let statics = new StaticModel(data)
            let err = statics.validateSync()
            if (err) throw Error(`invalid statics data`)
            await statics.save()
            return await this.sanitize(statics)
        }
    }

    static async get() {
        let statics = await StaticModel.findOne({})
        if (!statics) return DEFAULT_STATICS
        else return await this.sanitize(statics)
    }
}