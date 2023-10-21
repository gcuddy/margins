import { type, scope } from "arktype"


export const tweet_types = scope({
    url: {
        display_url: "string",
        expanded_url: "string",
        url: "string",
        start: "number",
        end: "number",
        'media_key?': "string"
    },
    mentions: {
        start: "number",
        end: "number",
        username: "string",
    },
    hashtags: {
        start: "number",
        end: "number",
        tag: "string",
    },
    variant: {
        bitrate: "number",
        content_type: "string",
        url: "string",
    },
    media: {
        media_key: "string",
        type: "'photo'|'video'|'animated_gif'",
        url: "string",
        'alt_text?': "string",
        "variants?": "variant[]",
    },
    user: {
        id: "string",
        name: "string",
        username: "string",
        profile_image_url: "string",
    },
    tweet: {
        data: {
            author_id: "string",
            created_at: "string",
            text: "string",
            id: "string",
            "conversation_id": "string",
            public_metrics: {
                retweet_count: "number",
                reply_count: "number",
                like_count: "number",
                quote_count: "number"
            },
            'attachments?': {
                media_keys: "string[]"
            },
            'entities?': {
                "urls?": "url[]",
                "mentions?": "mentions[]",
                "hashtags?": "hashtags[]"
            }
        },
        includes: {
            'media?': "media[]",
            'users?': "user[]"
        }
    },
}).compile();

export type Tweet = typeof tweet_types.tweet.infer
