import type { DocumentType, Entry } from '@prisma/client';

import { S3_BUCKET_PREFIX } from '$lib/constants';
import type { EntryInList } from '$lib/db/selects';
import type { MediaIdSchema } from '$lib/queries/server';
import { formatDate } from './date';

const prefix = `/tests`;

export type SlimEntry = {
	googleBooksId?: string | null;
	id: number;
	image?: string | null;
	podcastIndexId?: number | null;
	published: Date | null;
	spotifyId?: string | null;
	title: string | null;
	tmdbId?: number | null;
	type: DocumentType;
};

export function getId(entry: SlimEntry): string | number {
	if ((entry.type === 'movie' || entry.type === 'tv') && entry.tmdbId) {
		return entry.tmdbId;
	}
	if (entry.type === 'book' && entry.googleBooksId) {
		return entry.googleBooksId;
	}
	if (entry.type === 'album' && entry.spotifyId) {
		return entry.spotifyId;
	}
	if (/*entry.type === "podcast" && */ entry.podcastIndexId) {
		return `p${Number(entry.podcastIndexId).toString()}`;
	}
	return entry.id;
}

export function getType(type: Entry['type']) {
	if (type === 'rss') {
		return 'article';
	}
	return type;
}

export function make_link(entry: SlimEntry, subpath = '') {
	return `${prefix}/${getType(entry.type)}/${getId(entry)}${
		subpath ? `#${subpath}` : ''
	}`;
}

function get_domain(url: string) {
	const domain = url.replace(/https?:\/\//, '').split('/')[0];
	return domain;
}

export function get_image(entry: {
	image?: string | null;
	uri?: string | null;
}) {
	console.log(entry.image);
	if (entry.image) {
		return entry.image?.startsWith('/')
			? S3_BUCKET_PREFIX + entry.image.slice(1)
			: entry.image;
	} else {
		return `https://icon.horse/icon/${get_domain(entry.uri ?? '')}`;
	}
}

export const mediaTypes = ['album', 'book', 'movie', 'tv', 'podcast'] as const;
export type MediaType = (typeof mediaTypes)[number];

export function isMediaType(type: unknown): type is MediaType {
	return mediaTypes.includes(type as any);
}

// see mediaIdSchema
export function getIdKeyName<TNoEntry extends boolean = false>(
	type: Entry['type'],
	opts?: {
		idAsEntryId?: boolean;
		throwErrorIfNotMedia?: TNoEntry;
	},
): TNoEntry extends true
	? 'spotifyId' | 'googleBooksId' | 'tmdbId' | 'podcastIndexId'
	:
			| 'spotifyId'
			| 'googleBooksId'
			| 'tmdbId'
			| 'podcastIndexId'
			| 'id'
			| 'entryId' {
	const { idAsEntryId = false, throwErrorIfNotMedia = false } = opts ?? {};
	switch (type) {
		case 'album':
			return 'spotifyId';
		case 'book':
			return 'googleBooksId';
		case 'movie':
		case 'tv':
			return 'tmdbId';
		case 'podcast':
			return 'podcastIndexId';
		default:
			if (throwErrorIfNotMedia) {
				throw new Error(`Cannot get id key name for entry type ${type}`);
			}
			return idAsEntryId ? 'entryId' : ('id' as any);
	}
}

export function makeMediaSchema(
	id: string | number,
	type: MediaType,
): MediaIdSchema {
	if (type === 'podcast') {
		return {
			podcastIndexId: Number(id),
			type,
		};
	} else if (type === 'album') {
		return {
			spotifyId: String(id),
			type,
		};
	} else if (type === 'book') {
		return {
			googleBooksId: String(id),
			type,
		};
	} else if (type === 'movie' || type === 'tv') {
		return {
			tmdbId: Number(id),
			type,
		};
	} else {
		throw new Error(`Invalid media type ${type}`);
	}
}

export function formatEntryPublished(
	entry: SlimEntry & { published: Date | null },
) {
	if (!entry.published) {
		return '';
	}
	return formatDate(
		entry.published,
		entry.type === 'article' ||
			entry.type === 'podcast' ||
			entry.type === 'video'
			? {
					day: 'numeric',
					month: 'short',
					year: '2-digit',
			  }
			: {
					year: 'numeric',
			  },
	);
}

export function getRevisitLanguage(type: Entry['type']) {
	if (type === 'album' || type === 'podcast') {
		return 'Re-listen';
	} else if (type === 'book' || type === 'article') {
		return 'Re-read';
	} else if (type === 'movie' || type === 'tv' || type === 'video') {
		return 'Re-watch';
	} else if (type === 'board_game' || type === 'game') {
		return 'Re-play';
	} else {
		return 'Re-visit';
	}
}
