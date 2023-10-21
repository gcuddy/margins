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

// taken from:
// https://github.com/spotify/spotify-web-api-ts-sdk/blob/main/src/types.ts

export interface Copyright {
    text: string
    type: string
}

export interface ExternalIds {
    upc: string
}

export interface ExternalUrls {
    spotify: string
}

export interface Image {
    url: string;
    height: number;
    width: number;
}

export interface Restrictions {
    reason: string
}


export interface SimplifiedArtist {
    external_urls: ExternalUrls
    href: string
    id: string
    name: string
    type: string
    uri: string
}

export interface Followers {
    href: string | null
    total: number
}

export interface Artist extends SimplifiedArtist {
    followers: Followers
    genres: string[]
    images: Image[]
    popularity: number
}

interface AlbumBase {
    album_type: string
    available_markets: string[]
    copyrights: Copyright[]
    external_ids: ExternalIds
    external_urls: ExternalUrls
    genres: string[]
    href: string
    id: string
    images: Image[]
    label: string
    name: string
    popularity: number
    release_date: string
    release_date_precision: string
    restrictions?: Restrictions
    total_tracks: number
    type: string
    uri: string
}


export interface SimplifiedAlbum extends AlbumBase {
    album_group: string
    artists: SimplifiedArtist[]
}

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

export interface Album extends AlbumBase {
	artists: Artist[];
	tracks: PagingObject<SimplifiedTrack>;
}

export interface LinkedFrom {
	external_urls: ExternalUrls;
	href: string;
	id: string;
	type: string;
	uri: string;
}

export interface SimplifiedTrack {
	artists: SimplifiedArtist[];
	available_markets: string[];
	disc_number: number;
	duration_ms: number;
	episode: boolean;
	explicit: boolean;
	external_urls: ExternalUrls;
	href: string;
	id: string;
	is_local: boolean;
	name: string;
	preview_url: string | null;
	track: boolean;
	track_number: number;
	type: string;
	uri: string;
	is_playable?: boolean;
	linked_from?: LinkedFrom;
	restrictions?: Restrictions;
}

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
			return cached as Album;
		}
		const token = await getSpotifyToken();
		const response = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (!response.ok) {
			console.log({ response });
			throw new Error('Failed to get spotify album');
		}
		const data = await response.json();
		await redis.set(`spotify-album:${id}`, data, {
			ex: 60 * 60 * 24,
		});
		return data as Album;
	},
	artist: {
		albums: async (id: string) => {
			const cached = await redis.get(`spotify-artist-albums:${id}`);
			if (cached) {
				return cached as PagingObject<SimplifiedAlbum>;
			}
			const token = await getSpotifyToken();
			const response = await fetch(
				`https://api.spotify.com/v1/artists/${id}/albums?include_groups=album`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			if (!response.ok) {
				throw new Error('Failed to get spotify artist albums');
			}
			const data = await response.json();
			await redis.set(`spotify-artist-albums:${id}`, data, {
				ex: 60 * 60 * 24,
			});
			return data as PagingObject<SimplifiedAlbum>;
		},
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
