import { error, json, redirect, text } from '@sveltejs/kit';

import {
	PUBLIC_SPOTIFY_CLIENT_ID,
	PUBLIC_SPOTIFY_REDIRECT_URI,
} from '$env/static/public';
import { db } from '$lib/db';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch, locals, request, url }) => {
	const code = url.searchParams.get('code') || null;
	const api = new URL('https://accounts.spotify.com/api/token');
	api.searchParams.set('grant_type', 'authorization_code');
	if (code) {
		api.searchParams.set('code', code);
	}
	api.searchParams.set('redirect_uri', PUBLIC_SPOTIFY_REDIRECT_URI);

	const session = await locals.auth.validate();
	if (!session) {
		error(401, 'Unauthorized');
	}

	const res = await fetch(api, {
		headers: {
			Authorization: `Basic ${Buffer.from(
				`${PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
			).toString('base64')}`,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'POST',
	});
	if (res.status === 200) {
		// TODO: fix this
		const referrer = request.headers.get('Referer');
		const data = await res.json();
		const { access_token, expires_in, refresh_token } = data as {
			access_token: string;
			expires_in: number;
			refresh_token: string;
		};
		const u = `/settings/integrations?spotify_access_token=${access_token}&spotify_refresh_token=${refresh_token}&spotify_expires_in=${expires_in}`;

		// add these as integration
		await db
			.insertInto('Integration')
			.values({
				accessToken: access_token,
				expiresIn: expires_in,
				refreshToken: refresh_token,
				serviceName: 'spotify',
				updatedAt: new Date(),
				userId: session.user.userId,
			})
			.onDuplicateKeyUpdate({
				accessToken: access_token,
				expiresIn: expires_in,
				refreshToken: refresh_token,
			})
			.executeTakeFirst();

		redirect(307, u);
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
		error(400, res.status.toString());
	}
	// return text("Callback");
};
