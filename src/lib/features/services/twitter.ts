import { TWITTER_API_BEARER, TWITTER_API_SECRET } from "$env/static/private";
import { PUBLIC_TWITTER_API_KEY } from "$env/static/public";
import { TwitterApi } from "twitter-api-v2";

const twitterClient = new TwitterApi(TWITTER_API_BEARER);
// const twitterClient = new TwitterApi({
// 	appKey: TWITTER_API_KEY,
// 	appSecret: TWITTER_API_SECRET,
// });

export const twitter = twitterClient.readOnly;
