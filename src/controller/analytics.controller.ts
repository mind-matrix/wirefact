import { RequestHandler } from "express";
import { AnalyticsService } from "../service/analytics.service";
import { IController } from "./icontroller";

export const AnalyticsController = {
    visits: {
        async all(req, res, next) {
            let deviceId = <string>(req.headers['client-fingerprint'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress)
            let deviceInfoHeader = <string>req.headers['device-info']
            if (deviceId && deviceInfoHeader) {
                let deviceInfoParts = deviceInfoHeader.split(",")
                if (deviceInfoParts.length === 2) {
                    let deviceInfo = { platform: deviceInfoParts[0], os: deviceInfoParts[1] }
                    AnalyticsService.addVisit(deviceId, deviceInfo)
                }
            }
            next()
        }
    }
} as IController as { [k: string]: { [k: string]: RequestHandler } }