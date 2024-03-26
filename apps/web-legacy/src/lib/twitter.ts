import { TWITTER_API_BEARER } from "$env/static/private";

/** Errors included in response payload with a OK HTTP status (code ~= 200) */
export interface InlineErrorV2 {
    value?: string;
    detail: string;
    title: string;
    resource_type?: string;
    parameter?: string;
    resource_id?: string;
    reason?: string;
    type: string;
}
export type DataAndIncludeV2<D, I> = { data: D, includes?: I, errors?: InlineErrorV2[] };
export type TypeOrArrayOf<T> = T | T[];

export type TTweetv2Expansion = 'attachments.poll_ids' | 'attachments.media_keys' | 'author_id' | 'referenced_tweets.id' | 'in_reply_to_user_id' | 'edit_history_tweet_ids' | 'geo.place_id' | 'entities.mentions.username' | 'referenced_tweets.id.author_id';
export type TTweetv2MediaField = 'duration_ms' | 'height' | 'media_key' | 'preview_image_url' | 'type' | 'url' | 'width' | 'public_metrics' | 'non_public_metrics' | 'organic_metrics' | 'alt_text' | 'variants';
export type TTweetv2PlaceField = 'contained_within' | 'country' | 'country_code' | 'full_name' | 'geo' | 'id' | 'name' | 'place_type';
export type TTweetv2PollField = 'duration_minutes' | 'end_datetime' | 'id' | 'options' | 'voting_status';
export type TTweetv2TweetField = 'attachments' | 'author_id' | 'context_annotations' | 'conversation_id' | 'created_at' | 'entities' | 'geo' | 'id' | 'in_reply_to_user_id' | 'lang' | 'public_metrics' | 'non_public_metrics' | 'promoted_metrics' | 'organic_metrics' | 'edit_controls' | 'possibly_sensitive' | 'referenced_tweets' | 'reply_settings' | 'source' | 'text' | 'withheld';
export type TTweetv2UserField = 'created_at' | 'description' | 'entities' | 'id' | 'location' | 'name' | 'pinned_tweet_id' | 'profile_image_url' | 'protected' | 'public_metrics' | 'url' | 'username' | 'verified' | 'verified_type' | 'withheld';
export interface Tweetv2FieldsParams {
    expansions: TypeOrArrayOf<TTweetv2Expansion> | string;
    'media.fields': TypeOrArrayOf<TTweetv2MediaField> | string;
    'place.fields': TypeOrArrayOf<TTweetv2PlaceField> | string;
    'poll.fields': TypeOrArrayOf<TTweetv2PollField> | string;
    'tweet.fields': TypeOrArrayOf<TTweetv2TweetField> | string;
    'user.fields': TypeOrArrayOf<TTweetv2UserField> | string;
}
export class TwitterApi {
    private bearerToken: string;
    private twitter_base_url = 'https://api.twitter.com';
    private version = '/2';

    constructor(bearerToken: string) {
        this.bearerToken = bearerToken;
    }

    async get<T, P extends Record<PropertyKey, any>>(endpoint: string, params?: P) { try {
        console.log({base: this.twitter_base_url, endpoint})
        const url = new URL(this.version + endpoint, this.twitter_base_url);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    url.searchParams.set(key, value.join(','))
                } else {
                    url.searchParams.append(key, value);
                }
            });
            // decode commas
            url.search = url.search.replace(/%2C/g, ',');
        }
        console.log(url.toString())
        return fetch(url.toString(), {
            headers: {
                Authorization: `Bearer ${this.bearerToken}`,
            },
        }).then((res) => res.json() as Promise<T>)
        .catch((err) => {
            console.error(err);
            throw err;
        })
    } catch(e) {
        console.error(e);
        throw e;
    }
    }

    singleTweet(id: string, params?: Partial<Tweetv2FieldsParams>) {
        // TODO: type
        return this.get(`/tweets/${id}`, params);
    }

}

export const twitter = new TwitterApi(TWITTER_API_BEARER)
