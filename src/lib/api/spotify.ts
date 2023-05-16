import { redis } from "$lib/redis";

import { SPOTIFY_CLIENT_SECRET } from "$env/static/private";
import { PUBLIC_SPOTIFY_CLIENT_ID } from "$env/static/public";


type SpotifyTokenResponse = {
    access_token: string;
    token_type: string;
    expires_in: number;
}

interface PagingObject<T> {
    href: string;
    items: T[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
}

type ArtistObject = {
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}

type ImageObject = {
    height: number;
    url: string;
    width: number;
}

type AlbumObject = {
    album_type: string;
    total_tracks: number;
    artists: ArtistObject[];
    external_urls: {
        spotify: string;
    };
    href: string;
    label: string;
    id: string;
    images: ImageObject[];
    name: string;
    release_date: string;
    release_date_precision: string;
    tracks: {
        href: string;
        total: number;
        items: {
            artists: ArtistObject[];
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
        }[]
    }
    type: string;
    uri: string;
}

type AlbumSearchResponse = {
    albums: PagingObject<AlbumObject>;
}


async function getSpotifyToken() {
    console.time("spotify-token")
    const cached = await redis.get('spotify-token');
    if (cached) {
        const parsed = cached as SpotifyTokenResponse;
        const expires = new Date(new Date().getTime() + parsed.expires_in * 1000);
        if (expires > new Date()) {
            console.timeEnd("spotify-token")
            return parsed.access_token;
        }
    }
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(PUBLIC_SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
        },
        body: 'grant_type=client_credentials'
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
        ex: parsed.expires_in
    })
    console.timeEnd("spotify-token")
    return parsed.access_token;
}

const spotify = {
    search: async (query: string) => {
        // check cache
        console.time("spotify-search")
        const cached = await redis.get(`spotify-search:${query}`);
        if (cached) {
            console.log("cache hit");
            console.timeEnd("spotify-search")
            return cached as AlbumSearchResponse;
        }
        const token = await getSpotifyToken();
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album`, {
            headers: {
                'Authorization': 'Bearer ' + token
            },
        });
        if (!response.ok) {
            throw new Error('Failed to search spotify');
        }
        const data = await response.json();
        await redis.set(`spotify-search:${query}`, data, {
            ex: 60 * 60 * 24
        });
        console.timeEnd("spotify-search")
        return data as AlbumSearchResponse;
    },
    album: async (id: string) => {
        const cached = await redis.get(`spotify-album:${id}`);
        if (cached) {
            return cached as AlbumObject;
        }
        const token = await getSpotifyToken();
        const response = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            },
        });
        if (!response.ok) {
            throw new Error('Failed to get spotify album');
        }
        const data = await response.json();
        await redis.set(`spotify-album:${id}`, data, {
            ex: 60 * 60 * 24
        });
        return data as AlbumObject;
    }
}

export default spotify;