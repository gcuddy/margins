import { error, fail } from '@sveltejs/kit';

import { db } from '$lib/db';
import { hasTokenExpired } from './utils';
import { Spotify } from '$lib/features/services/spotify-user';

export async function load({ locals, fetch }) {
	// integrations
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, 'Unauthorized');
	}
	let spotify = await db
		.selectFrom('Integration')
		.selectAll()
		.where('userId', '=', session.user.userId)
		.where('serviceName', '=', 'spotify')
		.executeTakeFirst();
	// TODO: check refreshToken and refresh if necessary

	let spotifyInfo: SpotifyApi.UserObjectPrivate | null = null;

	// TODO this all needs a refactor, duplicated code with spotify/import as well

	const isExpired = spotify ? hasTokenExpired(spotify) : null;

	if (isExpired && spotify) {
		const res = await fetch(
			`/api/spotify/refresh_token?refresh_token=${spotify.refreshToken}`,
		);
		const data = (await res.json()) as {
			access_token: string;
			expires_in: number;
			refresh_token: string;
		};
		const { access_token, expires_in, refresh_token } = data;
		spotify = {
			...spotify,
			accessToken: access_token,
			expiresIn: expires_in,
			refreshToken: refresh_token,
			timestamp: new Date(),
		};
		await db
			.updateTable('Integration')
			.set({
				accessToken: access_token,
				expiresIn: expires_in,
				refreshToken: refresh_token,
				timestamp: new Date(),
			})
			.where('userId', '=', session.user.userId)
			.where('serviceName', '=', 'spotify')
			.execute();
	}

	// if (spotify) {
	// 	const isExpired = hasTokenExpired(spotify);
	// 	console.log({ isExpired, spotify, now: Date.now() });
	// 	if (true) {
	// 		// refresh token
	// 		const res = await fetch(
	// 			`/api/spotify/refresh_token?refresh_token=${spotify.refreshToken}`,
	// 		);
	// 		const data = (await res.json()) as {
	// 			access_token: string;
	// 			expires_in: number;
	// 			refresh_token: string;
	// 		};
	// 		console.log({ data });
	// 		const { access_token, expires_in, refresh_token } = data;
	// 		spotify = {
	// 			...spotify,
	// 			accessToken: access_token,
	// 			expiresIn: expires_in,
	// 			refreshToken: refresh_token,
	// 			timestamp: new Date(),
	// 		};
	// 		await db
	// 			.updateTable('Integration')
	// 			.set({
	// 				accessToken: access_token,
	// 				expiresIn: expires_in,
	// 				refreshToken: refresh_token,
	// 				timestamp: new Date(),
	// 			})
	// 			.where('userId', '=', session.user.userId)
	// 			.where('serviceName', '=', 'spotify')
	// 			.execute();
	// 	}

	// 	const s = new Spotify(spotify.accessToken!);
	// 	const res = await s.get<SpotifyApi.UserObjectPrivate>('/me');
	// 	if (res) {
	// 		spotifyInfo = res;
	// 	}
	// }

	return {
		spotify,
		spotifyInfo,
		isExpired,
		title: 'Integrations',
	};
}

export const actions = {
	async removeIntegration({ locals, request }) {
		const session = await locals.auth.validate();
		if (!session) {
			return fail(401);
		}
		const data = await request.formData();
		const serviceName = data.get('serviceName');
		if (!serviceName || typeof serviceName !== 'string') {
			return fail(400);
		}
		await db
			.deleteFrom('Integration')
			.where('userId', '=', session.user.userId)
			.where('serviceName', '=', serviceName)
			.execute();

		return {
			success: true,
		};
	},
};
