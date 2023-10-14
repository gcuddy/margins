import type { DocumentType, Entry } from '@prisma/client';

import { S3_BUCKET_PREFIX } from '$lib/constants';
import type { EntryInList } from '$lib/db/selects';
import type { MediaIdSchema } from '$lib/queries/server';
import { formatDate } from './date';

const prefix = `/tests`;

export type SlimEntry = {
	googleBooksId?: string | null;
	id?: number;
	image?: string | null;
	podcastIndexId?: number | null;
	published: Date | null;
	spotifyId?: string | null;
	title: string | null;
	tmdbId?: number | null;
	type: DocumentType;
};

export type SlimmerEntry = Pick<
	SlimEntry,
	'type' | 'tmdbId' | 'googleBooksId' | 'spotifyId' | 'podcastIndexId' | 'id'
>;

export function getId(entry: SlimmerEntry): string | number {
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
	if (entry.id) {
		return entry.id;
	}
	throw new Error(`Cannot get id for entry ${entry}`);
}

export function getType(type: Entry['type']) {
	if (type === 'rss') {
		return 'article';
	}
	return type;
}

export function make_link(entry: SlimmerEntry, subpath = '') {
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
export function getIdKeyName<
	TNoEntry extends boolean = false,
	TIdAsEntryId extends boolean = false,
>(
	type: string,
	opts?: {
		idAsEntryId?: TIdAsEntryId;
		throwErrorIfNotMedia?: TNoEntry;
	},
): TNoEntry extends true
	? 'spotifyId' | 'googleBooksId' | 'tmdbId' | 'podcastIndexId'
	: TIdAsEntryId extends true
	? 'spotifyId' | 'googleBooksId' | 'tmdbId' | 'podcastIndexId' | 'entryId'
	: 'spotifyId' | 'googleBooksId' | 'tmdbId' | 'podcastIndexId' | 'id' {
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
	entry: Pick<SlimEntry, 'published' | 'type'>,
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

export function getRevisitLanguage(type?: Entry['type'], pastTense = false) {
	if (type === 'album' || type === 'podcast') {
		return pastTense ? 'Re-listened' : 'Re-listen';
	} else if (type === 'book' || type === 'article') {
		return pastTense ? 'Re-read' : 'Re-read';
	} else if (type === 'movie' || type === 'tv' || type === 'video') {
		return pastTense ? 'Re-watched' : 'Re-watch';
	} else if (type === 'board_game' || type === 'game') {
		return pastTense ? 'Re-played' : 'Re-play';
	} else {
		return pastTense ? 'Re-visited' : 'Re-visit';
	}
}

export function getConsumedLanguage(type?: Entry['type'], pastTense = false) {
	if (type === 'album' || type === 'podcast') {
		return pastTense ? 'Listened' : 'Listen';
	} else if (type === 'book' || type === 'article') {
		return pastTense ? 'Read' : 'Read';
	} else if (type === 'movie' || type === 'tv' || type === 'video') {
		return pastTense ? 'Watched' : 'Watch';
	} else if (type === 'board_game' || type === 'game') {
		return pastTense ? 'Played' : 'Play';
	} else {
		return pastTense ? 'Visited' : 'Visit';
	}
}
