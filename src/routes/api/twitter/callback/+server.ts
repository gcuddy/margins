import { TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET } from "$env/static/private";
import { error, json, redirect, text } from "@sveltejs/kit";
import { TwitterApi } from "twitter-api-v2";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url, cookies }) => {
	const { state, code } = Object.fromEntries(url.searchParams);
	const sessionState = cookies.get("twitter_state");
	const codeVerifier = cookies.get("twitter_codeVerifier");
	console.log({ state, code, sessionState, codeVerifier });
	if (!codeVerifier || !state || !sessionState || !code) {
		throw error(400, "Invalid request");
	}
	if (state !== sessionState) {
		throw error(400, "States dont match");
	}
	console.log({ TWITTER_CLIENT_ID });
	const client = new TwitterApi({ clientId: TWITTER_CLIENT_ID, clientSecret: TWITTER_CLIENT_SECRET });
	// return text("Not implemented");
	// const { accessToken, expiresIn, refreshToken, scope } = await client.loginWithOAuth2({
	// 	code,
	// 	codeVerifier,
	// 	redirectUri: `/settings/integrations/twitter`,
	// });
	// return json({ accessToken, expiresIn, refreshToken, scope });
	// throw redirect(
	// 	307,
	// 	`/settings/integrations/twitter?accessToken=${accessToken}&expiresIn=${expiresIn}&refreshToken=${refreshToken}`
	// );
	// return json(loggedIn);
	const { accessToken, refreshToken, expiresIn } = await client
		.loginWithOAuth2({
			code,
			codeVerifier,
			redirectUri: `http://localhost:5173/api/twitter/callback`,
		})
		.catch((e) => {
			console.error(e);
			throw error(403, "Invalid verifier or access tokens!");
		});

	console.log({ code, codeVerifier, redirectUri: `http://localhost:5173/api/twitter/callback` });

	// return json({ accessToken });
	throw redirect(
		308,
		`/settings/integrations/twitter?accessToken=${accessToken}&expiresIn=${expiresIn}&refreshToken=${refreshToken}`
	);
	// .then(async ({ client: loggedClient, accessToken, refreshToken, expiresIn }) => {
	// 	// {loggedClient} is an authenticated client in behalf of some user
	// 	// Store {accessToken} somewhere, it will be valid until {expiresIn} is hit.
	// 	// If you want to refresh your token later, store {refreshToken} (it is present if 'offline.access' has been given as scope)

	// 	// Example request
	// 	const { data: userObject } = await loggedClient.v2.me();
	// 	return json(userObject);
	// })
	// .catch(() => {
	// 	throw error(403, "Invalid verifier or access tokens!");
	// });

	// cookies.set
};
