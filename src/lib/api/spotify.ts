import { SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_SPOTIFY_CLIENT_ID } from '$env/static/public';
import { redis } from '$lib/redis';

type SpotifyTokenResponse = {
	access_token: string;
	expires_in: number;
	token_type: string;
};

type PagingObject<T> = {
	href: string;
	items: Array<T>;
	limit: number;
	next: string | null;
	offset: number;
	previous: string | null;
	total: number;
};

type ArtistObject = {
	external_urls: {
		spotify: string;
	};
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;
};

type ImageObject = {
	height: number;
	url: string;
	width: number;
};

type AlbumObject = {
	album_type: string;
	artists: Array<ArtistObject>;
	external_urls: {
		spotify: string;
	};
	href: string;
	id: string;
	images: Array<ImageObject>;
	label: string;
	name: string;
	release_date: string;
	release_date_precision: string;
	total_tracks: number;
	tracks: {
		href: string;
		items: Array<{
			artists: Array<ArtistObject>;
			disc_number: number;
			duration_ms: number;
			explicit: boolean;
			external_urls: {
				spotify: string;
			};
			href: string;
			id: string;
			is_local: boolean;
			name: string;
			track_number: number;
			type: string;
			uri: string;
		}>;
		total: number;
	};
	type: string;
	uri: string;
};

type AlbumSearchResponse = {
	albums: PagingObject<AlbumObject>;
};

async function getSpotifyToken() {
	console.time('spotify-token');
	const cached = await redis.get('spotify-token');
	if (cached) {
		const parsed = cached as SpotifyTokenResponse;
		const expires = new Date(new Date().getTime() + parsed.expires_in * 1000);
		if (expires > new Date()) {
			console.timeEnd('spotify-token');
			return parsed.access_token;
		}
	}
	const response = await fetch('https://accounts.spotify.com/api/token', {
		body: 'grant_type=client_credentials',
		headers: {
			Authorization: `Basic ${Buffer.from(
				`${PUBLIC_SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
			).toString('base64')}`,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'POST',
	});
	if (!response.ok) {
		console.log({ response });
		const jsojn = await response.json();
		console.log({ jsojn });
		throw new Error('Failed to get spotify token');
	}
	const data = await response.json();
	const parsed = data as SpotifyTokenResponse;
	await redis.set('spotify-token', parsed, {
		ex: parsed.expires_in,
	});
	console.timeEnd('spotify-token');
	return parsed.access_token;
}

const spotify = {
	album: async (id: string) => {
		const cached = await redis.get(`spotify-album:${id}`);
		if (cached) {
			return cached as AlbumObject;
		}
		const token = await getSpotifyToken();
		const response = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (!response.ok) {
			throw new Error('Failed to get spotify album');
		}
		const data = await response.json();
		await redis.set(`spotify-album:${id}`, data, {
			ex: 60 * 60 * 24,
		});
		return data as AlbumObject;
	},
	search: async (query: string) => {
		// check cache
		console.time('spotify-search');
		const cached = await redis.get(`spotify-search:${query}`);
		if (cached) {
			console.log('cache hit');
			console.timeEnd('spotify-search');
			return cached as AlbumSearchResponse;
		}
		const token = await getSpotifyToken();
		const response = await fetch(
			`https://api.spotify.com/v1/search?q=${encodeURIComponent(
				query,
			)}&type=album`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		if (!response.ok) {
			throw new Error('Failed to search spotify');
		}
		const data = await response.json();
		await redis.set(`spotify-search:${query}`, data, {
			ex: 60 * 60 * 24,
		});
		console.timeEnd('spotify-search');
		return data as AlbumSearchResponse;
	},
};

export default spotify;
