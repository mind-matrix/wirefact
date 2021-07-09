import { BloomFilter } from "bloomfilter"
import _ from "lodash"
import { FilterQuery, QueryOptions } from "mongoose"
import { AnalyticsModel, IAnalyticsDocument } from "../model/analytics.model"

export interface IAnalytics {
    visits: {
        devices: {
            [platform: string]: {
                [os: string]: {
                    unique: number
                    returning: number
                }
            }
        }
    }
    year: number
    month: number
}

export class AnalyticsService {

    static async sanitize(analytics: IAnalyticsDocument): Promise<IAnalytics>
    static async sanitize(analytics: IAnalyticsDocument[]): Promise<IAnalytics[]>
    static async sanitize(analytics: null): Promise<null>
    static async sanitize(analytics: IAnalyticsDocument | IAnalyticsDocument[] | null) {
        const fields = ["visits.devices","year","month"]
        if (!analytics) return null
        if (Array.isArray(analytics)) return <IAnalytics[]><unknown>Promise.all(analytics.map(async a => {
            return _.pick(a.toJSON({ virtuals: true }), fields)
        }))
        return <IAnalytics><unknown>_.pick(analytics.toJSON({ virtuals: true }), fields)
    }

    static async addVisit(id: string, info: { platform: string, os: string }) {
        let year = new Date().getFullYear()
        let month = new Date().getMonth()
        let block = await AnalyticsModel.findOne({ year, month })
        if (block) {
            let bloom = new BloomFilter(block.visits.bloomBuckets, 8)
            if (!bloom.test(id)) {
                bloom.add(id)
                block.visits.bloomBuckets = [].slice.call(bloom.buckets)
                if (info.platform in block.visits.devices) {
                    if (info.os in block.visits.devices[info.platform]) {
                        block.visits.devices[info.platform][info.os].unique += 1
                    } else {
                        block.visits.devices[info.platform][info.os] = { unique: 1, returning: 0 }
                    }
                } else {
                    block.visits.devices[info.platform] = { [info.os]: { unique: 1, returning: 0 } }
                }
            } else {
                if (info.platform in block.visits.devices) {
                    if (info.os in block.visits.devices[info.platform]) {
                        block.visits.devices[info.platform][info.os].returning += 1
                    } else {
                        block.visits.devices[info.platform][info.os] = { unique: 0, returning: 1 }
                    }
                } else {
                    block.visits.devices[info.platform] = { [info.os]: { unique: 0, returning: 1 } }
                }
            }
            block.markModified("visits")
            await block.save()
            return { block }
        } else {
            let analytics = new AnalyticsModel({
                visits: {
                    devices: {
                        [info.platform]: {
                            [info.os]: {
                                unique: 1,
                                returning: 0
                            }
                        }
                    }
                },
                year,
                month
            })
            await analytics.save()
            return await this.sanitize(analytics)
        }
    }

    static async findOne(filters: FilterQuery<IAnalyticsDocument> = {}, options: QueryOptions = {}) {
        let analytics = await AnalyticsModel.findOne(filters, null, options)
        if (!analytics) return null
        return await this.sanitize(analytics)
    }

    static async find(filters: FilterQuery<IAnalyticsDocument> = {}, options: QueryOptions = {}) {
        let analytics = await AnalyticsModel.find(filters, null, options)
        return await this.sanitize(analytics)
    }
}