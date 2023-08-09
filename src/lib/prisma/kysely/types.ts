import type { ColumnType } from 'kysely';
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
	? ColumnType<S, I | undefined, U>
	: ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const Status = {
	Backlog: 'Backlog',
	Now: 'Now',
	Archive: 'Archive'
} as const;
export type Status = typeof Status[keyof typeof Status];
export const Color = {
	Yellow: 'Yellow',
	Blue: 'Blue',
	Green: 'Green',
	Pink: 'Pink',
	Purple: 'Purple'
} as const;
export type Color = typeof Color[keyof typeof Color];
export const RelationType = {
	Related: 'Related',
	SavedFrom: 'SavedFrom',
	Grouped: 'Grouped'
} as const;
export type RelationType = typeof RelationType[keyof typeof RelationType];
export const AnnotationType = {
	bookmark: 'bookmark',
	note: 'note',
	annotation: 'annotation',
	reply: 'reply',
	document: 'document',
	qa: 'qa'
} as const;
export type AnnotationType = typeof AnnotationType[keyof typeof AnnotationType];
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
	board_game: 'board_game'
} as const;
export type DocumentType = typeof DocumentType[keyof typeof DocumentType];
export const CollectionItemType = {
	Entry: 'Entry',
	Annotation: 'Annotation',
	Section: 'Section',
	Collection: 'Collection'
} as const;
export type CollectionItemType = typeof CollectionItemType[keyof typeof CollectionItemType];
export const FavoriteType = {
	FOLDER: 'FOLDER',
	FAVORITE: 'FAVORITE'
} as const;
export type FavoriteType = typeof FavoriteType[keyof typeof FavoriteType];
export const Entry_location = {
	inbox: 'inbox',
	soon: 'soon',
	later: 'later',
	archive: 'archive'
} as const;
export type Entry_location = typeof Entry_location[keyof typeof Entry_location];
export const State_type = {
	inbox: 'inbox',
	soon: 'soon',
	later: 'later',
	archive: 'archive'
} as const;
export type State_type = typeof State_type[keyof typeof State_type];
export type Annotation = {
	id: string;
	createdAt: Generated<Timestamp>;
	updatedAt: Generated<Timestamp>;
	body: string | null;
	type: Generated<AnnotationType>;
	private: Generated<number>;
	/**
	 * @zod.custom.use(TargetSchema)
	 */
	target: unknown | null;
	entryId: number | null;
	parentId: string | null;
	/**
	 * The "soft delete" time. Deletions are cleared after 30 days.
	 */
	deleted: Timestamp | null;
	userId: Generated<string>;
	sortOrder: Generated<number>;
	bookmarkId: number | null;
	editedAt: Timestamp | null;
	color: Generated<Color>;
	contentData: unknown | null;
	/**
	 * Optional title, used for longer notes unassociated with an entryo
	 */
	title: string | null;
	/**
	 * chosenIcon used for documents only?
	 * @zod.custom.use(chosenIcon)
	 */
	chosenIcon: unknown | null;
	html: string | null;
	/**
	 * Auto-generated from the target
	 */
	quote: string | null;
	exact: string | null;
	start: number | null;
	srs: Generated<number>;
	response: string | null;
	due_timestamp: Timestamp | null;
	last_reviewed_at: Timestamp | null;
	interval_ms: number | null;
	srs_created_at: Timestamp | null;
};
export type annotation_ref = {
	referencerId: string;
	referencingId: string;
};
export type annotation_tag = {
	tagId: number;
	annotationId: string;
};
export type annotation_to_entry_reference = {
	createdAt: Generated<Timestamp>;
	updatedAt: Generated<Timestamp>;
	entryId: number;
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
	private: Generated<number>;
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
	starred: Generated<number>;
	css: string | null;
	description: string | null;
	wiki: string | null;
	classification: string | null;
	pdf: number | null;
	html: string | null;
	readLater: Generated<number>;
	bookmark: Generated<number>;
	position: Generated<number>;
	trash: Generated<number>;
	location: Generated<string>;
	type: Generated<number>;
	userId: string;
	favoriteId: number | null;
};
export type AuthKey = {
	id: string;
	hashed_password: string | null;
	user_id: string;
	primary_key: Generated<number>;
	expires: number | null;
};
export type AuthorizationKey = {
	id: string;
	userId: string;
};
export type AuthSession = {
	id: string;
	user_id: string;
	idle_expires: number;
	active_expires: Generated<number>;
};
export type AuthUser = {
	id: string;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	email: string;
	username: Generated<string>;
	avatar: string | null;
	default_state_id: number | null;
	default_archive_id: number | null;
	home_items: unknown | null;
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
	private: Generated<number>;
	interactionId: number | null;
	favoriteId: number | null;
	deleted: Timestamp | null;
	is_read: Generated<number>;
	progress: Generated<number>;
	context: unknown | null;
	screenshot: string | null;
	source: string | null;
	dueDate: Timestamp | null;
	snoozedUntil: Timestamp | null;
	/**
	 * The original url of the bookmark, if it's different than the entry's url
	 */
	originalUrl: string | null;
	status: Generated<Status>;
	sort_order: Generated<number>;
	/**
	 * The timestamp that this content should be next seen, ala SRS. It can be user-set or via algorithm. Different than due, similar to snooze.
	 */
	review_timestamp: number | null;
	bookmarked: Generated<number>;
	title: string | null;
	author: string | null;
};
export type Collection = {
	id: Generated<number>;
	name: string;
	private: Generated<number>;
	/**
	 * @zod.custom.use(chosenIcon)
	 */
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
	/**
	 * This applies to sections only
	 */
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
	/**
	 * context node refers to a source or referrer — for example, a Discord Server, or another user
	 */
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
	location: Entry_location | null;
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
	/**
	 * Original represents original data (html, title) in case we've re-download and/or changes...?
	 */
	original: unknown | null;
	/**
	 * @zod.custom.use(recipeSchema)
	 */
	recipe: unknown | null;
	podcastIndexId: number | null;
	/**
	 * The duration of the entry, in seconds
	 */
	duration: number | null;
	enclosureLength: number | null;
	enclosureType: string | null;
	enclosureUrl: string | null;
	googleBooksId: string | null;
	/**
	 * The TMDB id, if it's a movie or TV show.
	 */
	tmdbId: number | null;
	/**
	 * @zod.custom.use(schemaOrgSchemas)
	 */
	schemaOrg: unknown | null;
	/**
	 * Tmdb data - could also store this in "original"?
	 */
	tmdbData: unknown | null;
	screenshot: string | null;
	extended: unknown | null;
	/**
	 * Youtube ID, if it's a youtube video
	 */
	youtubeId: string | null;
	pageCount: number | null;
	genres: string | null;
	language: string | null;
	/**
	 * The publisher for books, company for plays, etc.
	 */
	publisher: string | null;
	author_extra: unknown | null;
	spotifyId: string | null;
	pdf_fingerprint: string | null;
	owned_by_id: string | null;
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
	/**
	 * The name of the folder. Only applies to favorites of type folder.
	 */
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
	podcast: Generated<number>;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	active: Generated<number>;
	/**
	 * Velocity refers to the amount of times a feed is published per day.
	 */
	velocity: number | null;
	/**
	 * IF we're using a podcast, then we use podcastIndex to save/index entries. Do we even need to save them into our db? Probably — what if pidx goes down, or something.
	 */
	podcastIndexId: number | null;
	/**
	 * Store lastParsed time to diff against feed updated time
	 */
	lastParsed: Timestamp | null;
	/**
	 * Additional data provided by podcastIndex
	 */
	podcastIndexData: unknown | null;
	guid: string | null;
	itunesId: number | null;
	/**
	 * Deprecated
	 */
	itunes_id: string | null;
};
export type Interaction = {
	id: Generated<number>;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	is_read: Generated<number | null>;
	progress: Generated<number | null>;
	finished: Generated<number | null>;
	userId: string;
	last_viewed: Generated<Timestamp>;
	last_annotated: Generated<Timestamp>;
	last_interaction: Generated<Timestamp>;
	entryId: number;
	/**
	 * The current page, if it's a book
	 */
	currentPage: number | null;
	epsiodes_watched: unknown | null;
	/**
	 * Optionally, a title for the interaction
	 */
	title: string | null;
	date_finished: Timestamp | null;
	date_started: Timestamp | null;
	note: string | null;
	rating: number | null;
};
export type InvitationCode = {
	code: string;
	used: Generated<number>;
	ownerId: string;
	usedById: string | null;
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
	/**
	 * The type of the relation
	 */
	type: Generated<RelationType>;
	userId: string;
	entryId: number;
	relatedEntryId: number;
};
export type SmartList = {
	id: Generated<number>;
	name: string;
	filter: unknown | null;
	viewOptions: unknown | null;
	conditions: unknown | null;
	/**
	 * @zod.custom.use(chosenIcon)
	 */
	icon: unknown | null;
	createdAt: Generated<Timestamp>;
	description: string | null;
	private: Generated<number>;
	updatedAt: Generated<Timestamp>;
	userId: Generated<string>;
};
export type State = {
	id: Generated<number>;
	/**
	 * Whether or not this state represents things to be looked at later.
	 * The name of the state
	 */
	name: string;
	/**
	 * State's UI color as a hex string
	 */
	color: string | null;
	/**
	 * The type of the state
	 */
	type: State_type;
	/**
	 * The position of the state
	 */
	position: Generated<number>;
	description: string | null;
	userId: string;
	default: Generated<number>;
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
	download_full: Generated<number>;
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
export type Task = {
	id: Generated<number>;
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
export type UserEntry = {
	id: Generated<number>;
};
export type UserFollows = {
	A: string;
	B: string;
};
export type DB = {
	_AnnotationToTag: AnnotationToTag;
	_EntryToTag: EntryToTag;
	_SubscriptionToTag: SubscriptionToTag;
	_UserFollows: UserFollows;
	Annotation: Annotation;
	annotation_ref: annotation_ref;
	annotation_tag: annotation_tag;
	annotation_to_entry_reference: annotation_to_entry_reference;
	Article: Article;
	auth_key: AuthKey;
	auth_session: AuthSession;
	auth_user: AuthUser;
	AuthorizationKey: AuthorizationKey;
	Bookmark: Bookmark;
	Collection: Collection;
	CollectionItems: CollectionItems;
	ColorDescription: ColorDescription;
	Context: Context;
	ContextNode: ContextNode;
	Entry: Entry;
	EntryData: EntryData;
	EntryInteraction: Interaction;
	EntryMedia: EntryMedia;
	EntryTag: EntryTag;
	Favorite: Favorite;
	Feed: Feed;
	InvitationCode: InvitationCode;
	Log: Log;
	Person: Person;
	person_to_entry: person_to_entry;
	Relation: Relation;
	SmartList: SmartList;
	State: State;
	Stylesheet: Stylesheet;
	Subscription: Subscription;
	Tag: Tag;
	Taggings: Tagging;
	TagOnEntry: TagOnEntry;
	Task: Task;
	TwitterIntegration: TwitterIntegration;
	UserEntry: UserEntry;
};
