import { TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET } from "$env/static/private";
import { redirect } from "@sveltejs/kit";
import { TwitterApi } from "twitter-api-v2";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ cookies }) => {
	const client = new TwitterApi({ clientId: TWITTER_CLIENT_ID, clientSecret: TWITTER_CLIENT_SECRET });
	const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
		"http://localhost:5173/api/twitter/callback",
		{ scope: ["tweet.read", "users.read", "offline.access"] }
	);
	console.log({ codeVerifier, state });
	cookies.set("twitter_codeVerifier", codeVerifier, {
		path: "/",
		// set cookie to expire after a month
		maxAge: 60 * 60 * 24 * 30,
	});
	cookies.set("twitter_state", state, {
		path: "/",
		// set cookie to expire after a month
		maxAge: 60 * 60 * 24 * 30,
	});
	throw redirect(307, url);
};
