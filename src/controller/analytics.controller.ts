import e, { RequestHandler } from "express";
import { AnalyticsService } from "../service/analytics.service";
import { IController } from "./icontroller";

export const AnalyticsController = {
    visits: {
        async all(req, res, next) {
            if (req.query.token && req.query.token === process.env.APP_TOKEN) {
                // Request is from an APP SERVER: no actions required
            } else {
                let deviceId = <string>req.headers['client-fingerprint']
                let deviceInfoHeader = <string>req.headers['device-info']
                if (deviceId && deviceInfoHeader) {
                    let deviceInfoParts = deviceInfoHeader.split(",")
                    if (deviceInfoParts.length === 2) {
                        let deviceInfo = { platform: deviceInfoParts[0], os: deviceInfoParts[1] }
                        AnalyticsService.addVisit(deviceId, deviceInfo)
                    }
                }
            }
            next()
        }
    }
} as IController as { [k: string]: { [k: string]: RequestHandler } }