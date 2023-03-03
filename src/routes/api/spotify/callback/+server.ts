import { PUBLIC_SPOTIFY_CLIENT_ID, PUBLIC_SPOTIFY_REDIRECT_URI } from "$env/static/public";
import { error, json, redirect, text } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch, url, locals, request }) => {
	const code = url.searchParams.get("code") || null;
	const api = new URL("https://accounts.spotify.com/api/token");
	api.searchParams.set("grant_type", "authorization_code");
	if (code) api.searchParams.set("code", code);
	api.searchParams.set("redirect_uri", PUBLIC_SPOTIFY_REDIRECT_URI);

	const session = await locals.validate();
	console.log({ session });
	const res = await fetch(api, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization:
				"Basic " +
				Buffer.from(PUBLIC_SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET).toString("base64"),
		},
	});
	if (res.status === 200) {
		// TODO: fix this
		const referrer = request.headers.get("Referer");
		console.log({ referrer });
		const data = await res.json();
		const { access_token, refresh_token, expires_in } = data;
		const u = `/settings/integrations/spotify?access_token=${access_token}&refresh_token=${refresh_token}&expires_in=${expires_in}`;
		console.log({ u });
		throw redirect(307, u);
		return json(data);
		// const { refresh_token, accses_token } = await res.json();
		// const session = await locals.validateUser();
		// console.log({ session, refresh_token, accses_token });
		// cookies.set("spotify_refresh_token", refresh_token, {
		// 	path: "/",
		// });
		// cookies.set("spotify_access_token", accses_token, {
		// 	path: "/",
		// });
		// throw redirect(300, "/");
		// throw redirect(
		// 	302,
		// 	`/?refresh_token=${refresh_token}&access_token=${accses_token}`
		// );
		// console.log({ refresh_token });
		// const refresh = await fetch(`/api/spotify/refresh_token?refresh_token=${refresh_token}`);
		// if (refresh.status === 200) {
		// 	return json(await refresh.json());
		// } else {
		// 	return text(refresh.status.toString());
		// }
		// return json(await user.json());
		// return json(await res.json());
	} else {
		throw error(400, res.status.toString());
	}
	// return text("Callback");
};
