import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
	? ColumnType<S, I | undefined, U>
	: ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;
export type Color = "Yellow" | "Blue" | "Green" | "Pink" | "Purple";
export type RelationType = "Related" | "SavedFrom";
export type AnnotationType = "bookmark" | "note" | "annotation" | "reply" | "document";
export type Location = "inbox" | "soon" | "later" | "archive";
export type DocumentType =
	| "article"
	| "rss"
	| "pdf"
	| "epub"
	| "bookmark"
	| "image"
	| "video"
	| "tweet"
	| "audio"
	| "book"
	| "movie"
	| "tv"
	| "song"
	| "album"
	| "playlist"
	| "recipe"
	| "game"
	| "board_game";
export type CollectionItemType = "Entry" | "Annotation" | "Section" | "Collection";
export type FetchFrequency = "realtime" | "daily" | "weekly" | "rnthly";
export type FeedType = "PODCAST";
export type FavoriteType = "FOLDER" | "FAVORITE";
export type Annotation = {
	id: string;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	body: string | null;
	contentData: unknown | null;
	chosenIcon: unknown | null;
	title: string | null;
	editedAt: Timestamp | null;
	type: AnnotationType;
	private: Generated<boolean>;
	target: unknown | null;
	entryId: number | null;
	parentId: string | null;
	deleted: Timestamp | null;
	userId: Generated<string>;
	sortOrder: Generated<number>;
	bookmarkId: number | null;
	color: Generated<Color>;
};
export type Article = {
	id: Generated<number>;
	title: string;
	content: string | null;
	textContent: string | null;
	author: string | null;
	private: Generated<boolean>;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	readProgress: Generated<number | null>;
	slug: string | null;
	url: string | null;
	siteName: string | null;
	colorHash: string | null;
	date: Timestamp | null;
	image: string | null;
	wordCount: number | null;
	starred: Generated<boolean>;
	css: string | null;
	description: string | null;
	wiki: string | null;
	classification: string | null;
	pdf: boolean | null;
	html: string | null;
	readLater: Generated<boolean>;
	bookmark: Generated<boolean>;
	position: Generated<number>;
	trash: Generated<boolean>;
	location: Generated<string>;
	type: Generated<number>;
	userId: string;
	favoriteId: number | null;
};
export type AuthorizationKey = {
	id: string;
	userId: string;
};
export type Bookmark = {
	id: Generated<number>;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	context: unknown | null;
	uri: string | null;
	entryId: number | null;
	userId: string;
	sortOrder: Generated<number | null>;
	is_read: Generated<boolean>;
	progress: Generated<number>;
	screenshot: string | null;
	data: unknown | null;
	originalUrl: string | null;
	dueDate: Timestamp | null;
	snoozedUntil: Timestamp | null;
	source: string | null;
	stateId: number | null;
	private: Generated<boolean>;
	interactionId: number | null;
	favoriteId: number | null;
	deleted: Timestamp | null;
};
export type Collection = {
	id: Generated<number>;
	name: string;
	private: Generated<boolean>;
	icon: Generated<unknown | null>;
	userId: string;
	description: string | null;
	contentData: unknown | null;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	viewOptions: unknown | null;
};
export type CollectionItems = {
	id: string;
	collectionId: number;
	position: Generated<number>;
	note: string | null;
	type: Generated<CollectionItemType>;
	title: string | null;
	parentId: string | null;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	annotationId: string | null;
	bookmarkId: number | null;
	entryId: number | null;
};
export type ColorDescription = {
	userId: string;
	color: Color;
	description: string | null;
};
export type Context = {
	id: Generated<number>;
	createdAt: Generated<Timestamp>;
	userId: string;
	entryId: number | null;
	feedId: number | null;
	url: string | null;
	description: string | null;
};
export type ContextNode = {
	id: string;
	name: string;
	url: string | null;
	description: string | null;
	userId: string;
	refers_to: string | null;
};
export type Entry = {
	createdAt: Generated<Timestamp>;
	author: string | null;
	location: Location | null;
	title: string | null;
	type: Generated<DocumentType>;
	updatedAt: Timestamp;
	id: Generated<number>;
	uri: string | null;
	html: string | null;
	text: string | null;
	image: string | null;
	guid: string | null;
	original: unknown | null;
	wordCount: number | null;
	siteName: string | null;
	summary: string | null;
	pageCount: number | null;
	screenshot: string | null;
	media: unknown | null;
	published: Timestamp | null;
	updated: Timestamp | null;
	podcastIndexId: bigint | null;
	googleBooksId: string | null;
	enclosureUrl: string | null;
	enclosureLength: number | null;
	enclosureType: string | null;
	schemaOrg: unknown | null;
	extended: unknown | null;
	publisher: string | null;
	language: string | null;
	genres: string | null;
	tmdbId: number | null;
	youtubeId: string | null;
	tmdbData: unknown | null;
	duration: number | null;
	feedId: number | null;
	recipe: unknown | null;
};
export type EntryData = {
	id: Generated<number>;
	html: string | null;
	text: string | null;
	custom: unknown | null;
	image: string | null;
	wordCount: number | null;
	summary: string | null;
	data: unknown | null;
	published: Timestamp | null;
	updated: Timestamp | null;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	entryId: number;
	userId: string;
};
export type EntryMedia = {
	id: Generated<number>;
	url: string | null;
	size: number | null;
	duration: number | null;
	type: string | null;
	title: string | null;
	documentDataId: number;
	entryId: number | null;
};
export type EntryTag = {
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	tagId: number;
	entryId: number;
	userId: string;
};
export type Favorite = {
	id: string;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	sortOrder: Generated<number | null>;
	userId: string;
	deleted: Timestamp | null;
	tagId: number | null;
	feedId: number | null;
	smartListId: number | null;
	type: Generated<FavoriteType>;
	folderName: string | null;
	parentId: string | null;
	annotationId: string | null;
	bookmarkId: number | null;
	collectionId: number | null;
	entryId: number | null;
};
export type Feed = {
	id: Generated<number>;
	itunes_id: string | null;
	itunesId: number | null;
	podcastIndexId: number | null;
	feedUrl: string | null;
	lastParsed: Timestamp | null;
	guid: string | null;
	title: string | null;
	link: string | null;
	creator: string | null;
	description: string | null;
	lastBuildDate: Timestamp | null;
	imageUrl: string | null;
	podcast: Generated<boolean>;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	active: Generated<boolean>;
	podcastIndexData: unknown | null;
	velocity: number | null;
};
export type Interaction = {
	id: Generated<number>;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	is_read: Generated<boolean | null>;
	progress: Generated<number | null>;
	currentPage: number | null;
	finished: Generated<boolean | null>;
	entryId: number;
	userId: string;
	last_viewed: Generated<Timestamp>;
	last_annotated: Generated<Timestamp>;
	last_interaction: Generated<Timestamp>;
};
export type InvitationCode = {
	code: string;
	used: Generated<boolean>;
	ownerId: string;
	usedById: string | null;
};
export type Key = {
	id: string;
	hashed_password: string | null;
	user_id: string;
	primary: boolean;
	expires: bigint | null;
};
export type Log = {
	id: Generated<number>;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	date: Timestamp;
	userId: string;
	entryId: number;
	duration: number | null;
	startingPage: number | null;
	endingPage: number | null;
	season: number | null;
	episode: number | null;
	note: string | null;
};
export type Relation = {
	id: string;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	type: Generated<RelationType>;
	userId: string;
	entryId: number;
	relatedEntryId: number;
};
export type Session = {
	id: string;
	user_id: string;
	active_expires: Generated<bigint>;
	idle_expires: bigint;
};
export type SmartList = {
	id: Generated<number>;
	createdAt: Generated<Timestamp>;
	updatedAt: Generated<Timestamp>;
	name: string;
	icon: Generated<unknown | null>;
	filter: unknown | null;
	conditions: unknown | null;
	viewOptions: unknown | null;
	private: Generated<boolean>;
	description: string | null;
	userId: Generated<string>;
};
export type State = {
	id: Generated<number>;
	name: string;
	color: string | null;
	type: Location;
	position: Generated<number>;
	description: string | null;
	userId: string;
	default: Generated<boolean>;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
};
export type Stylesheet = {
	id: Generated<number>;
	domain: string;
	css: string;
	userEntryId: number | null;
	userId: string;
};
export type Subscription = {
	id: Generated<number>;
	feedId: number;
	userId: string;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	title: string;
	download_full: Generated<boolean>;
};
export type Tag = {
	id: Generated<number>;
	name: string;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	viewOptions: unknown | null;
	userId: string;
};
export type Tagging = {
	id: Generated<number>;
	tagId: number;
	userId: string;
	feedId: number | null;
	bookmarkId: number | null;
};
export type TwitterIntegration = {
	id: Generated<number>;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	userId: string;
	accessToken: string | null;
	refreshToken: string | null;
	expiresIn: number;
	twitterId: string;
};
export type User = {
	id: string;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	email: string;
	username: Generated<string>;
	default_state_id: number | null;
	default_archive_id: number | null;
};
export type UserEntry = {
	id: Generated<number>;
};
export type DB = {
	Annotation: Annotation;
	Article: Article;
	AuthorizationKey: AuthorizationKey;
	Bookmark: Bookmark;
	Collection: Collection;
	CollectionItems: CollectionItems;
	ColorDescription: ColorDescription;
	Context: Context;
	ContextNode: ContextNode;
	Entry: Entry;
	EntryData: EntryData;
	EntryMedia: EntryMedia;
	EntryTag: EntryTag;
	Favorite: Favorite;
	Feed: Feed;
	EntryInteraction: Interaction;
	InvitationCode: InvitationCode;
	key: Key;
	Log: Log;
	Relation: Relation;
	session: Session;
	SmartList: SmartList;
	State: State;
	Stylesheet: Stylesheet;
	Subscription: Subscription;
	Tag: Tag;
	Taggings: Tagging;
	TwitterIntegration: TwitterIntegration;
	user: User;
	UserEntry: UserEntry;
};
