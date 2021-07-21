import AWS from "aws-sdk";
import { StaticModel } from "../model/_static.model";
import { DEFAULT_STATICS } from "./_static.service";
import tokenizer from "sbd";

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
        
        if (statics.store.narration.charactersProcessed + (characters*2) > 4500000) throw Error("cannot complete request at the moment.")

        statics.store.narration.charactersProcessed += (characters*2)
        await statics.save()

        let segments = []

        if (characters > 1500) {
            let sentences = tokenizer.sentences(text, { sanitize: true })
            for (let sentence of sentences) {
                if (sentence.length > 1500) segments.push(...(<string[]>sentence.match(/.{1,1499}/g)))
                else segments.push(sentence)
            }
        } else {
            segments = [ text ]
        }

        const polly = new AWS.Polly()
        
        let outputs = {
            male: [],
            female: []
        } as {
            male: Buffer[]
            female: Buffer[]
        }

        for (let segment of segments) {
            let male = await polly.synthesizeSpeech({
                Text: segment,
                OutputFormat: "mp3",
                VoiceId: "Matthew"
            }).promise()
            let female = await polly.synthesizeSpeech({
                Text: segment,
                OutputFormat: "mp3",
                VoiceId: "Joanna"
            }).promise()
            if (male.AudioStream instanceof Buffer && female.AudioStream instanceof Buffer) {
                outputs.male.push(male.AudioStream)
                outputs.female.push(female.AudioStream)
            } else {
                console.error("could not decode audio data segment - possible network failure")
            }
        }
        
        return {
            male: Buffer.concat(outputs.male, outputs.male.reduce((len, a) => len + a.length, 0)),
            female: Buffer.concat(outputs.female, outputs.female.reduce((len, a) => len + a.length, 0))
        }
    }
}
