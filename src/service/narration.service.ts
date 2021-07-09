import AWS from "aws-sdk";
import { StaticModel } from "../model/_static.model";
import { DEFAULT_STATICS } from "./_static.service";

AWS.config.update({
    region: 'ap-south-1',
    signatureVersion: 'v4'
})

export class NarrationService {
    private static monthDiffAbs(d1: Date, d2: Date) {
        let months
        months = (d2.getFullYear() - d1.getFullYear()) * 12
        months -= d1.getMonth()
        months += d2.getMonth()
        return Math.round(months)
    }
    static async generate(text: string) {
        const characters = text.length
        
        let statics = await StaticModel.findOne({})
        if (!statics) {
            statics = new StaticModel(DEFAULT_STATICS)
        }
        if (this.monthDiffAbs(statics.store.narration.lastReset, new Date()) > 1) statics.store.narration.charactersProcessed = 0
        
        if (statics.store.narration.charactersProcessed + characters > 4500000) throw Error("cannot complete request at the moment.")

        statics.store.narration.charactersProcessed += characters
        await statics.save()

        const polly = new AWS.Polly()
        let male = await polly.synthesizeSpeech({
            Text: text,
            OutputFormat: "mp3",
            VoiceId: "Matthew"
        }).promise()
        let female = await polly.synthesizeSpeech({
            Text: text,
            OutputFormat: "mp3",
            VoiceId: "Joanna"
        }).promise()
        if (male.AudioStream instanceof Buffer && female.AudioStream instanceof Buffer) return { male: male.AudioStream, female: female.AudioStream }
        throw Error("could not decode audio data - possible network failure")
    }
}
