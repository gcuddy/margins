import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
	? ColumnType<S, I | undefined, U>
	: ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;
export type Status = "Backlog" | "Now" | "Archive";
export type Color = "Yellow" | "Blue" | "Green" | "Pink" | "Purple";
export type RelationType = "Related" | "SavedFrom";
export type AnnotationType =
	| "bookmark"
	| "note"
	| "annotation"
	| "reply"
	| "document";
export type Location = "inbox" | "soon" | "later" | "archive";
export type DocumentType =
	| "article"
	| "podcast"
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
export type CollectionItemType =
	| "Entry"
	| "Annotation"
	| "Section"
	| "Collection";
export type FavoriteType = "FOLDER" | "FAVORITE";
export type Annotation = {
	id: string;
	createdAt: Generated<Timestamp>;
	updatedAt: Generated<Timestamp>;
	body: string | null;
	type: AnnotationType;
	private: Generated<boolean>;
	target: unknown | null;
	entryId: number | null;
	parentId: string | null;
	deleted: Timestamp | null;
	userId: Generated<string>;
	sortOrder: Generated<number>;
	bookmarkId: number | null;
	editedAt: Timestamp | null;
	color: Generated<Color>;
	contentData: unknown | null;
	title: string | null;
	chosenIcon: unknown | null;
};
export type annotation_tag = {
	tagId: number;
	annotationId: string;
};
export type AnnotationToTag = {
	A: string;
	B: number;
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
	uri: string | null;
	entryId: number | null;
	userId: string;
	sortOrder: Generated<number | null>;
	data: unknown | null;
	stateId: number | null;
	private: Generated<boolean>;
	interactionId: number | null;
	favoriteId: number | null;
	deleted: Timestamp | null;
	is_read: Generated<boolean>;
	progress: Generated<number>;
	context: unknown | null;
	screenshot: string | null;
	source: string | null;
	dueDate: Timestamp | null;
	snoozedUntil: Timestamp | null;
	originalUrl: string | null;
	status: Generated<Status>;
};
export type Collection = {
	id: Generated<number>;
	name: string;
	private: Generated<boolean>;
	icon: unknown | null;
	userId: string;
	description: string | null;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	contentData: unknown | null;
	viewOptions: unknown | null;
};
export type CollectionItems = {
	id: string;
	collectionId: number;
	position: Generated<number>;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	annotationId: string | null;
	bookmarkId: number | null;
	entryId: number | null;
	note: string | null;
	parentId: string | null;
	type: Generated<CollectionItemType>;
	title: string | null;
};
export type ColorDescription = {
	userId: string;
	color: Color;
	description: string | null;
};
export type Context = {
	id: Generated<number>;
	url: string | null;
	description: string | null;
	createdAt: Generated<Timestamp>;
	entryId: number | null;
	feedId: number | null;
	userId: string;
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
	wordCount: number | null;
	siteName: string | null;
	summary: string | null;
	media: unknown | null;
	published: Timestamp | null;
	updated: Timestamp | null;
	feedId: number | null;
	original: unknown | null;
	recipe: unknown | null;
	podcastIndexId: bigint | null;
	duration: number | null;
	enclosureLength: number | null;
	enclosureType: string | null;
	enclosureUrl: string | null;
	googleBooksId: string | null;
	tmdbId: number | null;
	schemaOrg: unknown | null;
	tmdbData: unknown | null;
	screenshot: string | null;
	extended: unknown | null;
	youtubeId: string | null;
	pageCount: number | null;
	genres: string | null;
	language: string | null;
	publisher: string | null;
	author_extra: unknown | null;
};
export type EntryData = {
	id: Generated<number>;
	html: string | null;
	text: string | null;
	image: string | null;
	wordCount: number | null;
	summary: string | null;
	published: Timestamp | null;
	updated: Timestamp | null;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	userId: string;
	data: unknown | null;
	entryId: number;
	custom: unknown | null;
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
export type EntryToTag = {
	A: number;
	B: number;
};
export type Favorite = {
	id: string;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	userId: string;
	deleted: Timestamp | null;
	tagId: number | null;
	smartListId: number | null;
	annotationId: string | null;
	bookmarkId: number | null;
	entryId: number | null;
	feedId: number | null;
	sortOrder: Generated<number | null>;
	folderName: string | null;
	parentId: string | null;
	type: Generated<FavoriteType>;
	collectionId: number | null;
};
export type Feed = {
	id: Generated<number>;
	feedUrl: string | null;
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
	velocity: number | null;
	podcastIndexId: number | null;
	lastParsed: Timestamp | null;
	podcastIndexData: unknown | null;
	guid: string | null;
	itunesId: number | null;
	itunes_id: string | null;
};
export type Interaction = {
	id: Generated<number>;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	is_read: Generated<boolean | null>;
	progress: Generated<number | null>;
	finished: Generated<boolean | null>;
	userId: string;
	last_viewed: Generated<Timestamp>;
	last_annotated: Generated<Timestamp>;
	last_interaction: Generated<Timestamp>;
	entryId: number;
	currentPage: number | null;
	epsiodes_watched: unknown | null;
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
	entryId: number;
	note: string | null;
	userId: string;
	date: Timestamp;
	duration: number | null;
	endingPage: number | null;
	episode: number | null;
	season: number | null;
	startingPage: number | null;
};
export type Person = {
	id: Generated<number>;
	createdAt: Generated<Timestamp>;
	updatedAt: Generated<Timestamp>;
	name: string;
	tmdbId: number | null;
};
export type person_to_entry = {
	id: Generated<number>;
	createdAt: Generated<Timestamp>;
	updatedAt: Generated<Timestamp>;
	personId: number;
	entryId: number;
	role: string;
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
	idle_expires: bigint;
	active_expires: Generated<bigint>;
};
export type SmartList = {
	id: Generated<number>;
	name: string;
	filter: unknown | null;
	viewOptions: unknown | null;
	conditions: unknown | null;
	icon: unknown | null;
	createdAt: Generated<Timestamp>;
	description: string | null;
	private: Generated<boolean>;
	updatedAt: Generated<Timestamp>;
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
export type SubscriptionToTag = {
	A: number;
	B: number;
};
export type Tag = {
	id: Generated<number>;
	name: string;
	createdAt: Generated<Timestamp>;
	updatedAt: Generated<Timestamp>;
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
export type TagOnEntry = {
	id: Generated<number>;
	tagId: number;
	entryId: number;
	userId: string;
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
export type UserFollows = {
	A: string;
	B: string;
};
export type DB = {
	Annotation: Annotation;
	annotation_tag: annotation_tag;
	_AnnotationToTag: AnnotationToTag;
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
	_EntryToTag: EntryToTag;
	Favorite: Favorite;
	Feed: Feed;
	EntryInteraction: Interaction;
	InvitationCode: InvitationCode;
	key: Key;
	Log: Log;
	Person: Person;
	person_to_entry: person_to_entry;
	Relation: Relation;
	session: Session;
	SmartList: SmartList;
	State: State;
	Stylesheet: Stylesheet;
	Subscription: Subscription;
	_SubscriptionToTag: SubscriptionToTag;
	Tag: Tag;
	Taggings: Tagging;
	TagOnEntry: TagOnEntry;
	TwitterIntegration: TwitterIntegration;
	user: User;
	UserEntry: UserEntry;
	_UserFollows: UserFollows;
};
