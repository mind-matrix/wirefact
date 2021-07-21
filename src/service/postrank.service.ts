import { CommentModel, ICommentDocument } from "../model/comment.model";
import { IPostDocument, IPostMetricsDocument } from "../model/post.model";

export const PostRankScore = {
    async comment(comments: ICommentDocument[]) {
        return comments.reduce((a, comment) => a + comment.sentiment, 0)
    },
    async content(content: object) {
        return 0
    },
    async topics(topics: string[]) {
        return topics.length
    },
    async metrics(metrics: IPostMetricsDocument) {
        return metrics.views.verified.count * 1.25 + metrics.views.unverified.count * 0.85 // eq 1
    }
}

export class PostRankService {
    static async score<
        T extends keyof typeof PostRankScore,
        R extends Parameters<(typeof PostRankScore)[T]>[0]
    >
    (type: T, data: R) {
        return PostRankScore[type](<any>data)
    }

    static async rank(posts: IPostDocument[]) {
        
        const rankmap: Map<string, number> = new Map()

        for (let post of posts) {

            const comments = await CommentModel.find({ postId: post.id, censored: false, author: { $ne: post.author } })

            // comment score
            let score = {
                comment: await this.score("comment", comments),
                content: await this.score("content", post.content),
                topics: await this.score("topics", post.topics),
                metrics: await this.score("metrics", post.metrics)
            }

            let combined = (score.comment * 0.78) + score.content * (score.topics + 1) + score.metrics * 2 // eq 2
            rankmap.set(post.id, combined)
        }

        posts.sort((a, b) => {
            if (rankmap.get(a.id)! > rankmap.get(b.id)!) return 1
            if (rankmap.get(a.id)! < rankmap.get(b.id)!) return -1
            return 0
        })

        return posts
    }
}
