import { error } from '@sveltejs/kit';

import { db } from '$lib/db';
import { Spotify } from '$lib/features/services/spotify-user';

function hasTokenExpired({
	expiresIn,
	updatedAt,
}: {
	expiresIn: number | null;
	updatedAt: Date;
}) {
	if (!expiresIn) {
		return false;
	}
	const msElapsed = Date.now() - new Date(updatedAt).getTime();

	return msElapsed / 1000 > expiresIn;
}

export async function load({ fetch, locals }) {
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
		.executeTakeFirstOrThrow();

	const isExpired = hasTokenExpired(spotify);

	if (isExpired) {
		// refresh token
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
			updatedAt: new Date(),
		};
		await db
			.updateTable('Integration')
			.set({
				accessToken: access_token,
				expiresIn: expires_in,
				refreshToken: refresh_token,
				updatedAt: new Date(),
			})
			.where('userId', '=', session.user.userId)
			.where('serviceName', '=', 'spotify')
			.execute();
	}

	if (!spotify.accessToken) {
		throw error(500);
	}
	const spotifyApi = new Spotify(spotify.accessToken);

	const albums = await spotifyApi.get<SpotifyApi.UsersSavedAlbumsResponse>(
		'/me/albums?limit=50',
	);

	if (!albums) {
		throw error(500);
	}

	const spotifyAlbumIds = albums.items.map((item) => item.album.id);

	// check if albums already exist
	const existingAlbums = await db
		.selectFrom('Entry as e')
		.innerJoin('Bookmark as b', (join) =>
			join
				.onRef('b.entryId', '=', 'e.id')
				.on('b.userId', '=', session.user.userId),
		)
		.select(['b.id as bookmarkId', 'e.id as entryId', 'e.spotifyId'])
		.where('spotifyId', 'in', spotifyAlbumIds)
		.execute();

	// TODO: check refreshToken and refresh if necessary
	return {
		albums,
		existingAlbums,
		title: 'Spotify Import',
	};
}
