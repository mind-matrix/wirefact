import axios from "axios"

export class UrlShortenerService {
    static async shorten(sourceUrl: string) {
        const encodedSourceUrl = encodeURIComponent(sourceUrl)
        console.log("url: ", encodedSourceUrl)
        let response = await axios.get(`https://cutt.ly/api/api.php?key=${process.env.CUTTLY_API_KEY}&short=${encodedSourceUrl}`)
        console.log(response.data)
        let { url } = response.data
        if (url.status !== 7) return sourceUrl
        return url.shortLink
    }
}