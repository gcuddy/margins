// just adapted from prisma
export const DocumentType = {
	article: 'article',
	podcast: 'podcast',
	rss: 'rss',
	pdf: 'pdf',
	epub: 'epub',
	bookmark: 'bookmark',
	image: 'image',
	video: 'video',
	tweet: 'tweet',
	audio: 'audio',
	book: 'book',
	movie: 'movie',
	tv: 'tv',
	song: 'song',
	album: 'album',
	playlist: 'playlist',
	recipe: 'recipe',
	game: 'game',
	board_game: 'board_game',
} as const;

export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType];

export const Status = {
	Backlog: 'Backlog',
	Now: 'Now',
	Archive: 'Archive',
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export const ViewType = {
	All: 'All',
	Backlog: 'Backlog',
	Now: 'Now',
	Archive: 'Archive',
	Collection: 'Collection',
	CustomView: 'CustomView',
} as const;

export type ViewType = (typeof ViewType)[keyof typeof ViewType];

export const RelationType = {
	Related: 'Related',
	SavedFrom: 'SavedFrom',
	Grouped: 'Grouped',
} as const;

export type RelationType = (typeof RelationType)[keyof typeof RelationType];

export const EntryFilterType = {
	Library: 'Library',
	Subscriptions: 'Subscriptions',
	All: 'All',
} as const;

export type EntryFilterType =
	(typeof EntryFilterType)[keyof typeof EntryFilterType];

export const AnnotationType = {
	bookmark: 'bookmark',
	note: 'note',
	annotation: 'annotation',
	reply: 'reply',
	document: 'document',
	qa: 'qa',
} as const;

export type AnnotationType =
	(typeof AnnotationType)[keyof typeof AnnotationType];
