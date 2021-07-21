import Twitter from "twitter"

export class TwitterService {
    static tweet(data: { text?: string, media: Buffer } | { text: string }) {
        const client = new Twitter({
            consumer_key: process.env.TWITTER_CONSUMER_KEY!,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET!,
            access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY!,
            access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET!
        })
        return new Promise((resolve, reject) => {
            if ('media' in data) {
                client.post('media/upload', { media: data.media }, (err, media, response) => {
                    if (err) {
                        console.dir(err)
                        return reject(err)
                    }
                    let status = {
                        status: data.text??undefined,
                        media_ids: media.media_id_string
                    }
                    client.post('statuses/update', status, (err, tweet, response) => {
                        if (err) return reject(err)
                        resolve(tweet)
                    })
                })
            } else {
                client.post('statuses/update', { status: data.text }, (err, tweet, response) => {
                    if (err) {
                        console.dir(err)
                        return reject(err)
                    }
                    resolve(tweet)
                })
            }
        })
    }
}
