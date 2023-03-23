import { mysqlTable, mysqlSchema, AnyMySqlColumn, index, varchar, datetime, mediumtext, mysqlEnum, tinyint, json, int, double, uniqueIndex, text, longtext, primaryKey, bigint } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm/sql"

export const annotation = mysqlTable("Annotation", {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: datetime("updatedAt", { mode: 'string', fsp: 3 }).notNull(),
    body: mediumtext("body"),
    type: mysqlEnum("type", ['bookmark', 'note', 'annotation', 'reply', 'document']).notNull(),
    private: tinyint("private").default(1).notNull(),
    target: json("target"),
    entryId: int("entryId"),
    parentId: varchar("parentId", { length: 191 }),
    deleted: datetime("deleted", { mode: 'string', fsp: 3 }),
    userId: varchar("userId", { length: 191 }).default('').notNull(),
    sortOrder: double("sortOrder").notNull(),
    bookmarkId: int("bookmarkId"),
    editedAt: datetime("editedAt", { mode: 'string', fsp: 3 }),
    color: mysqlEnum("color", ['yellow', 'blue', 'green', 'pink', 'purple']).default('yellow').notNull(),
    contentData: json("contentData"),
    title: varchar("title", { length: 191 }),
    chosenIcon: json("chosenIcon"),
},
    (table) => {
        return {
            entryIdIdx: index("Annotation_entryId_idx").on(table.entryId),
            userIdIdx: index("Annotation_userId_idx").on(table.userId),
            parentIdIdx: index("Annotation_parentId_idx").on(table.parentId),
            bookmarkIdIdx: index("Annotation_bookmarkId_idx").on(table.bookmarkId),
        }
    });

export const article = mysqlTable("Article", {
    id: int("id").autoincrement().primaryKey().notNull(),
    title: text("title").notNull(),
    content: longtext("content"),
    textContent: longtext("textContent"),
    author: varchar("author", { length: 191 }),
    private: tinyint("private").default(1).notNull(),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: datetime("updatedAt", { mode: 'string', fsp: 3 }).notNull(),
    readProgress: double("readProgress"),
    slug: varchar("slug", { length: 191 }),
    url: varchar("url", { length: 191 }),
    siteName: varchar("siteName", { length: 191 }),
    colorHash: varchar("colorHash", { length: 191 }),
    date: datetime("date", { mode: 'string', fsp: 3 }),
    image: text("image"),
    wordCount: int("wordCount"),
    starred: tinyint("starred").default(0).notNull(),
    css: varchar("css", { length: 191 }),
    description: text("description"),
    wiki: varchar("wiki", { length: 191 }),
    classification: varchar("classification", { length: 191 }),
    pdf: tinyint("pdf"),
    html: varchar("html", { length: 191 }),
    readLater: tinyint("readLater").default(1).notNull(),
    bookmark: tinyint("bookmark").default(0).notNull(),
    position: int("position").default(0).notNull(),
    trash: tinyint("trash").default(0).notNull(),
    location: varchar("location", { length: 191 }).default('INBOX').notNull(),
    type: int("type").default(0).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    favoriteId: int("favoriteId"),
},
    (table) => {
        return {
            userIdUrlKey: uniqueIndex("Article_userId_url_key").on(table.userId, table.url),
            userIdIdx: index("Article_userId_idx").on(table.userId),
        }
    });

export const authorizationKey = mysqlTable("AuthorizationKey", {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
},
    (table) => {
        return {
            userIdKey: uniqueIndex("AuthorizationKey_userId_key").on(table.userId),
            userIdIdx: index("AuthorizationKey_userId_idx").on(table.userId),
        }
    });

export const bookmark = mysqlTable("Bookmark", {
    id: int("id").autoincrement().primaryKey().notNull(),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: datetime("updatedAt", { mode: 'string', fsp: 3 }).notNull(),
    uri: varchar("uri", { length: 191 }),
    entryId: int("entryId"),
    userId: varchar("userId", { length: 191 }).notNull(),
    sortOrder: int("sortOrder").default(0),
    data: json("data"),
    stateId: int("stateId"),
    private: tinyint("private").default(1).notNull(),
    interactionId: int("interactionId"),
    favoriteId: int("favoriteId"),
    deleted: datetime("deleted", { mode: 'string', fsp: 3 }),
    isRead: tinyint("is_read").default(0).notNull(),
    progress: double("progress").notNull(),
    context: json("context"),
    screenshot: varchar("screenshot", { length: 191 }),
    source: varchar("source", { length: 191 }),
    dueDate: datetime("dueDate", { mode: 'string', fsp: 3 }),
    snoozedUntil: datetime("snoozedUntil", { mode: 'string', fsp: 3 }),
    originalUrl: varchar("originalUrl", { length: 191 }),
},
    (table) => {
        return {
            interactionIdKey: uniqueIndex("Bookmark_interactionId_key").on(table.interactionId),
            uriEntryIdUserIdKey: uniqueIndex("Bookmark_uri_entryId_userId_key").on(table.uri, table.entryId, table.userId),
            uriIdx: index("Bookmark_uri_idx").on(table.uri),
            userIdIdx: index("Bookmark_userId_idx").on(table.userId),
            stateIdIdx: index("Bookmark_stateId_idx").on(table.stateId),
            interactionIdStateIdUriIdx: index("Bookmark_interactionId_stateId_uri_idx").on(table.interactionId, table.stateId, table.uri),
            userIdStateIdIdx: index("Bookmark_userId_stateId_idx").on(table.userId, table.stateId),
            uriEntryIdIdx: index("Bookmark_uri_entryId_idx").on(table.uri, table.entryId),
        }
    });

export const collection = mysqlTable("Collection", {
    id: int("id").autoincrement().primaryKey().notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    private: tinyint("private").default(1).notNull(),
    icon: json("icon"),
    userId: varchar("userId", { length: 191 }).notNull(),
    description: varchar("description", { length: 191 }),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: datetime("updatedAt", { mode: 'string', fsp: 3 }).notNull(),
    contentData: json("contentData"),
    viewOptions: json("viewOptions"),
},
    (table) => {
        return {
            userIdNameKey: uniqueIndex("Collection_userId_name_key").on(table.userId, table.name),
            userIdIdx: index("Collection_userId_idx").on(table.userId),
        }
    });

export const collectionItems = mysqlTable("CollectionItems", {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    collectionId: int("collectionId").notNull(),
    position: double("position").notNull(),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: datetime("updatedAt", { mode: 'string', fsp: 3 }).notNull(),
    annotationId: varchar("annotationId", { length: 191 }),
    bookmarkId: int("bookmarkId"),
    entryId: int("entryId"),
    note: varchar("note", { length: 191 }),
    parentId: varchar("parentId", { length: 191 }),
    type: mysqlEnum("type", ['entry', 'annotation', 'section', 'collection']).default('entry').notNull(),
    title: varchar("title", { length: 191 }),
},
    (table) => {
        return {
            annotationIdKey: uniqueIndex("CollectionItems_annotationId_key").on(table.annotationId),
            collectionIdAnnotationIdKey: uniqueIndex("CollectionItems_collectionId_annotationId_key").on(table.collectionId, table.annotationId),
            collectionIdEntryIdKey: uniqueIndex("CollectionItems_collectionId_entryId_key").on(table.collectionId, table.entryId),
            collectionIdBookmarkIdKey: uniqueIndex("CollectionItems_collectionId_bookmarkId_key").on(table.collectionId, table.bookmarkId),
            collectionIdIdx: index("CollectionItems_collectionId_idx").on(table.collectionId),
            bookmarkIdIdx: index("CollectionItems_bookmarkId_idx").on(table.bookmarkId),
            entryIdIdx: index("CollectionItems_entryId_idx").on(table.entryId),
            parentIdIdx: index("CollectionItems_parentId_idx").on(table.parentId),
        }
    });

export const colorDescription = mysqlTable("ColorDescription", {
    userId: varchar("userId", { length: 191 }).notNull(),
    color: mysqlEnum("color", ['yellow', 'blue', 'green', 'pink', 'purple']).notNull(),
    description: varchar("description", { length: 191 }),
},
    (table) => {
        return {
            userIdIdx: index("ColorDescription_userId_idx").on(table.userId),
            colorDescriptionUserIdColor: primaryKey(table.userId, table.color)
        }
    });

export const context = mysqlTable("Context", {
    id: int("id").autoincrement().primaryKey().notNull(),
    url: varchar("url", { length: 191 }),
    description: varchar("description", { length: 191 }),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
    entryId: int("entryId"),
    feedId: int("feedId"),
    userId: varchar("userId", { length: 191 }).notNull(),
},
    (table) => {
        return {
            userIdIdx: index("Context_userId_idx").on(table.userId),
            entryIdIdx: index("Context_entryId_idx").on(table.entryId),
            feedIdIdx: index("Context_feedId_idx").on(table.feedId),
        }
    });

export const contextNode = mysqlTable("ContextNode", {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    url: varchar("url", { length: 191 }),
    description: varchar("description", { length: 191 }),
    userId: varchar("userId", { length: 191 }).notNull(),
    refersTo: varchar("refers_to", { length: 191 }),
},
    (table) => {
        return {
            userIdIdx: index("ContextNode_userId_idx").on(table.userId),
        }
    });

export const entry = mysqlTable("Entry", {
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
    author: varchar("author", { length: 191 }),
    location: mysqlEnum("location", ['inbox', 'soon', 'later', 'archive']),
    title: varchar("title", { length: 2083 }),
    type: mysqlEnum("type", ['article', 'rss', 'pdf', 'epub', 'bookmark', 'image', 'video', 'tweet', 'audio', 'book', 'movie', 'tv', 'song', 'album', 'playlist', 'recipe', 'game', 'board_game']).default('article').notNull(),
    updatedAt: datetime("updatedAt", { mode: 'string', fsp: 3 }).notNull(),
    id: int("id").autoincrement().primaryKey().notNull(),
    uri: varchar("uri", { length: 191 }),
    html: longtext("html"),
    text: longtext("text"),
    image: varchar("image", { length: 2083 }),
    guid: varchar("guid", { length: 191 }),
    wordCount: int("wordCount"),
    siteName: varchar("siteName", { length: 191 }),
    summary: varchar("summary", { length: 255 }),
    media: json("media"),
    published: datetime("published", { mode: 'string', fsp: 3 }),
    updated: datetime("updated", { mode: 'string', fsp: 3 }),
    feedId: int("feedId"),
    original: json("original"),
    recipe: json("recipe"),
    podcastIndexId: bigint("podcastIndexId", { mode: "number" }),
    duration: int("duration"),
    enclosureLength: int("enclosureLength"),
    enclosureType: varchar("enclosureType", { length: 191 }),
    enclosureUrl: varchar("enclosureUrl", { length: 2083 }),
    googleBooksId: varchar("googleBooksId", { length: 191 }),
    tmdbId: int("tmdbId"),
    schemaOrg: json("schemaOrg"),
    tmdbData: json("tmdbData"),
    screenshot: varchar("screenshot", { length: 191 }),
    extended: json("extended"),
    youtubeId: varchar("youtubeId", { length: 191 }),
    pageCount: int("pageCount"),
    genres: varchar("genres", { length: 191 }),
    language: varchar("language", { length: 191 }),
    publisher: varchar("publisher", { length: 191 }),
},
    (table) => {
        return {
            podcastIndexIdKey: uniqueIndex("Entry_podcastIndexId_key").on(table.podcastIndexId),
            googleBooksIdKey: uniqueIndex("Entry_googleBooksId_key").on(table.googleBooksId),
            tmdbIdKey: uniqueIndex("Entry_tmdbId_key").on(table.tmdbId),
            youtubeIdKey: uniqueIndex("Entry_youtubeId_key").on(table.youtubeId),
            uriKey: uniqueIndex("Entry_uri_key").on(table.uri),
            uriIdKey: uniqueIndex("Entry_uri_id_key").on(table.uri, table.id),
            feedIdIdx: index("Entry_feedId_idx").on(table.feedId),
            idPublishedCreatedAtIdx: index("Entry_id_published_createdAt_idx").on(table.id, table.published, table.createdAt),
            // textIdx: index("Entry_text_idx").on(table.text),
            // textTitleAuthorIdx: index("Entry_text_title_author_idx").on(table.text, table.title, table.author),
            titleAuthorIdx: index("Entry_title_author_idx").on(table.title, table.author),
        }
    });

export const entryData = mysqlTable("EntryData", {
    id: int("id").autoincrement().primaryKey().notNull(),
    html: longtext("html"),
    text: longtext("text"),
    image: varchar("image", { length: 191 }),
    wordCount: int("wordCount"),
    summary: varchar("summary", { length: 191 }),
    published: datetime("published", { mode: 'string', fsp: 3 }),
    updated: datetime("updated", { mode: 'string', fsp: 3 }),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: datetime("updatedAt", { mode: 'string', fsp: 3 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    data: json("data"),
    entryId: int("entryId").notNull(),
    custom: json("custom"),
},
    (table) => {
        return {
            entryIdKey: uniqueIndex("EntryData_entryId_key").on(table.entryId),
            entryIdUserIdKey: uniqueIndex("EntryData_entryId_userId_key").on(table.entryId, table.userId),
            entryIdIdx: index("EntryData_entryId_idx").on(table.entryId),
            userIdIdx: index("EntryData_userId_idx").on(table.userId),
        }
    });

export const entryInteraction = mysqlTable("EntryInteraction", {
    id: int("id").autoincrement().primaryKey().notNull(),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: datetime("updatedAt", { mode: 'string', fsp: 3 }).notNull(),
    isRead: tinyint("is_read").default(0),
    progress: double("progress"),
    finished: tinyint("finished").default(0),
    userId: varchar("userId", { length: 191 }).notNull(),
    lastViewed: datetime("last_viewed", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
    lastAnnotated: datetime("last_annotated", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
    lastInteraction: datetime("last_interaction", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
    entryId: int("entryId").notNull(),
    currentPage: int("currentPage"),
},
    (table) => {
        return {
            userIdEntryIdKey: uniqueIndex("EntryInteraction_userId_entryId_key").on(table.userId, table.entryId),
            userIdIdx: index("EntryInteraction_userId_idx").on(table.userId),
            entryIdIdx: index("EntryInteraction_entryId_idx").on(table.entryId),
        }
    });

export const entryMedia = mysqlTable("EntryMedia", {
    id: int("id").autoincrement().primaryKey().notNull(),
    url: varchar("url", { length: 191 }),
    size: int("size"),
    duration: int("duration"),
    type: varchar("type", { length: 191 }),
    title: varchar("title", { length: 191 }),
    documentDataId: int("documentDataId").notNull(),
    entryId: int("entryId"),
},
    (table) => {
        return {
            documentDataIdIdx: index("EntryMedia_documentDataId_idx").on(table.documentDataId),
            entryIdIdx: index("EntryMedia_entryId_idx").on(table.entryId),
        }
    });

export const entryTag = mysqlTable("EntryTag", {
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: datetime("updatedAt", { mode: 'string', fsp: 3 }).notNull(),
    tagId: int("tagId").notNull(),
    entryId: int("entryId").notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
},
    (table) => {
        return {
            tagIdIdx: index("EntryTag_tagId_idx").on(table.tagId),
            entryIdIdx: index("EntryTag_entryId_idx").on(table.entryId),
            userIdIdx: index("EntryTag_userId_idx").on(table.userId),
            entryTagTagIdEntryIdUserId: primaryKey(table.tagId, table.entryId, table.userId)
        }
    });

export const favorite = mysqlTable("Favorite", {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: datetime("updatedAt", { mode: 'string', fsp: 3 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    deleted: datetime("deleted", { mode: 'string', fsp: 3 }),
    tagId: int("tagId"),
    smartListId: int("smartListId"),
    annotationId: varchar("annotationId", { length: 191 }),
    bookmarkId: int("bookmarkId"),
    entryId: int("entryId"),
    feedId: int("feedId"),
    sortOrder: double("sortOrder"),
    folderName: varchar("folderName", { length: 191 }),
    parentId: varchar("parentId", { length: 191 }),
    type: mysqlEnum("type", ['folder', 'favorite']).default('favorite').notNull(),
    collectionId: int("collectionId"),
},
    (table) => {
        return {
            tagIdKey: uniqueIndex("Favorite_tagId_key").on(table.tagId),
            annotationIdKey: uniqueIndex("Favorite_annotationId_key").on(table.annotationId),
            bookmarkIdKey: uniqueIndex("Favorite_bookmarkId_key").on(table.bookmarkId),
            userIdEntryIdKey: uniqueIndex("Favorite_userId_entryId_key").on(table.userId, table.entryId),
            collectionIdKey: uniqueIndex("Favorite_collectionId_key").on(table.collectionId),
            userIdAnnotationIdKey: uniqueIndex("Favorite_userId_annotationId_key").on(table.userId, table.annotationId),
            userIdCollectionIdKey: uniqueIndex("Favorite_userId_collectionId_key").on(table.userId, table.collectionId),
            userIdBookmarkIdKey: uniqueIndex("Favorite_userId_bookmarkId_key").on(table.userId, table.bookmarkId),
            userIdTagIdKey: uniqueIndex("Favorite_userId_tagId_key").on(table.userId, table.tagId),
            userIdFeedIdKey: uniqueIndex("Favorite_userId_feedId_key").on(table.userId, table.feedId),
            userIdSmartListIdKey: uniqueIndex("Favorite_userId_smartListId_key").on(table.userId, table.smartListId),
            userIdIdx: index("Favorite_userId_idx").on(table.userId),
            tagIdIdx: index("Favorite_tagId_idx").on(table.tagId),
            smartListIdIdx: index("Favorite_smartListId_idx").on(table.smartListId),
            bookmarkIdIdx: index("Favorite_bookmarkId_idx").on(table.bookmarkId),
            annotationIdIdx: index("Favorite_annotationId_idx").on(table.annotationId),
            feedIdIdx: index("Favorite_feedId_idx").on(table.feedId),
            entryIdIdx: index("Favorite_entryId_idx").on(table.entryId),
            collectionIdIdx: index("Favorite_collectionId_idx").on(table.collectionId),
            parentIdIdx: index("Favorite_parentId_idx").on(table.parentId),
        }
    });

export const feed = mysqlTable("Feed", {
    id: int("id").autoincrement().primaryKey().notNull(),
    feedUrl: varchar("feedUrl", { length: 191 }),
    title: varchar("title", { length: 191 }),
    link: varchar("link", { length: 191 }),
    creator: varchar("creator", { length: 191 }),
    description: text("description"),
    lastBuildDate: datetime("lastBuildDate", { mode: 'string', fsp: 3 }),
    imageUrl: text("imageUrl"),
    podcast: tinyint("podcast").default(0).notNull(),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: datetime("updatedAt", { mode: 'string', fsp: 3 }).notNull(),
    active: tinyint("active").default(1).notNull(),
    velocity: int("velocity"),
    podcastIndexId: int("podcastIndexId"),
    lastParsed: datetime("lastParsed", { mode: 'string', fsp: 3 }),
    podcastIndexData: json("podcastIndexData"),
    guid: varchar("guid", { length: 191 }),
    itunesId: int("itunesId"),
},
    (table) => {
        return {
            feedUrlKey: uniqueIndex("Feed_feedUrl_key").on(table.feedUrl),
            podcastIndexIdKey: uniqueIndex("Feed_podcastIndexId_key").on(table.podcastIndexId),
            podcastIndexIdIdx: index("Feed_podcastIndexId_idx").on(table.podcastIndexId),
        }
    });

export const invitationCode = mysqlTable("InvitationCode", {
    code: varchar("code", { length: 191 }).primaryKey().notNull(),
    used: tinyint("used").default(0).notNull(),
    ownerId: varchar("ownerId", { length: 191 }).notNull(),
    usedById: varchar("usedById", { length: 191 }),
},
    (table) => {
        return {
            usedByIdKey: uniqueIndex("InvitationCode_usedById_key").on(table.usedById),
            ownerIdIdx: index("InvitationCode_ownerId_idx").on(table.ownerId),
        }
    });

export const log = mysqlTable("Log", {
    id: int("id").autoincrement().primaryKey().notNull(),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: datetime("updatedAt", { mode: 'string', fsp: 3 }).notNull(),
    entryId: int("entryId").notNull(),
    note: varchar("note", { length: 191 }),
    userId: varchar("userId", { length: 191 }).notNull(),
    date: datetime("date", { mode: 'string', fsp: 3 }).notNull(),
    duration: int("duration"),
    endingPage: int("endingPage"),
    episode: int("episode"),
    season: int("season"),
    startingPage: int("startingPage"),
},
    (table) => {
        return {
            userIdEntryIdDateKey: uniqueIndex("Log_userId_entryId_date_key").on(table.userId, table.entryId, table.date),
            entryIdIdx: index("Log_entryId_idx").on(table.entryId),
            userIdIdx: index("Log_userId_idx").on(table.userId),
        }
    });

export const relation = mysqlTable("Relation", {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: datetime("updatedAt", { mode: 'string', fsp: 3 }).notNull(),
    type: mysqlEnum("type", ['related', 'savedfrom']).default('related').notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    entryId: int("entryId").notNull(),
    relatedEntryId: int("relatedEntryId").notNull(),
},
    (table) => {
        return {
            userIdEntryIdRelatedEntryIdKey: uniqueIndex("Relation_userId_entryId_relatedEntryId_key").on(table.userId, table.entryId, table.relatedEntryId),
            userIdIdx: index("Relation_userId_idx").on(table.userId),
            entryIdIdx: index("Relation_entryId_idx").on(table.entryId),
            relatedEntryIdIdx: index("Relation_relatedEntryId_idx").on(table.relatedEntryId),
            userIdEntryIdIdx: index("Relation_userId_entryId_idx").on(table.userId, table.entryId),
        }
    });

export const smartList = mysqlTable("SmartList", {
    id: int("id").autoincrement().primaryKey().notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    filter: json("filter"),
    viewOptions: json("viewOptions"),
    conditions: json("conditions"),
    icon: json("icon"),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
    description: varchar("description", { length: 191 }),
    private: tinyint("private").default(1).notNull(),
    updatedAt: datetime("updatedAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
    userId: varchar("userId", { length: 191 }).default('').notNull(),
},
    (table) => {
        return {
            userIdNameKey: uniqueIndex("SmartList_userId_name_key").on(table.userId, table.name),
            userIdIdx: index("SmartList_userId_idx").on(table.userId),
        }
    });

export const state = mysqlTable("State", {
    id: int("id").autoincrement().primaryKey().notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    color: varchar("color", { length: 191 }),
    type: mysqlEnum("type", ['inbox', 'soon', 'later', 'archive']).notNull(),
    position: double("position").notNull(),
    description: varchar("description", { length: 191 }),
    userId: varchar("userId", { length: 191 }).notNull(),
    default: tinyint("default").default(0).notNull(),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: datetime("updatedAt", { mode: 'string', fsp: 3 }).notNull(),
},
    (table) => {
        return {
            userIdIdx: index("State_userId_idx").on(table.userId),
        }
    });

export const stylesheet = mysqlTable("Stylesheet", {
    id: int("id").autoincrement().primaryKey().notNull(),
    domain: varchar("domain", { length: 191 }).notNull(),
    css: mediumtext("css").notNull(),
    userEntryId: int("userEntryId"),
    userId: varchar("userId", { length: 191 }).notNull(),
},
    (table) => {
        return {
            userEntryIdIdx: index("Stylesheet_userEntryId_idx").on(table.userEntryId),
            userIdIdx: index("Stylesheet_userId_idx").on(table.userId),
        }
    });

export const subscription = mysqlTable("Subscription", {
    id: int("id").autoincrement().primaryKey().notNull(),
    feedId: int("feedId").notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: datetime("updatedAt", { mode: 'string', fsp: 3 }).notNull(),
    title: varchar("title", { length: 191 }).notNull(),
    downloadFull: tinyint("download_full").default(0).notNull(),
},
    (table) => {
        return {
            userIdFeedIdKey: uniqueIndex("Subscription_userId_feedId_key").on(table.userId, table.feedId),
            userIdIdx: index("Subscription_userId_idx").on(table.userId),
            feedIdIdx: index("Subscription_feedId_idx").on(table.feedId),
        }
    });

export const tag = mysqlTable("Tag", {
    id: int("id").autoincrement().primaryKey().notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: datetime("updatedAt", { mode: 'string', fsp: 3 }).notNull(),
    viewOptions: json("viewOptions"),
    userId: varchar("userId", { length: 191 }).notNull(),
},
    (table) => {
        return {
            nameUserIdKey: uniqueIndex("Tag_name_userId_key").on(table.name, table.userId),
            userIdIdx: index("Tag_userId_idx").on(table.userId),
        }
    });

export const tagOnEntry = mysqlTable("TagOnEntry", {
    id: int("id").autoincrement().primaryKey().notNull(),
    tagId: int("tagId").notNull(),
    entryId: int("entryId").notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
},
    (table) => {
        return {
            tagIdEntryIdUserIdKey: uniqueIndex("TagOnEntry_tagId_entryId_userId_key").on(table.tagId, table.entryId, table.userId),
            tagIdIdx: index("TagOnEntry_tagId_idx").on(table.tagId),
            entryIdIdx: index("TagOnEntry_entryId_idx").on(table.entryId),
            userIdIdx: index("TagOnEntry_userId_idx").on(table.userId),
        }
    });

export const taggings = mysqlTable("Taggings", {
    id: int("id").autoincrement().primaryKey().notNull(),
    tagId: int("tagId").notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    feedId: int("feedId"),
    bookmarkId: int("bookmarkId"),
},
    (table) => {
        return {
            feedIdUserIdTagIdKey: uniqueIndex("Taggings_feedId_userId_tagId_key").on(table.feedId, table.userId, table.tagId),
            bookmarkIdUserIdTagIdKey: uniqueIndex("Taggings_bookmarkId_userId_tagId_key").on(table.bookmarkId, table.userId, table.tagId),
            userIdIdx: index("Taggings_userId_idx").on(table.userId),
            tagIdIdx: index("Taggings_tagId_idx").on(table.tagId),
            feedIdIdx: index("Taggings_feedId_idx").on(table.feedId),
            userIdTagIdIdx: index("Taggings_userId_tagId_idx").on(table.userId, table.tagId),
            userIdFeedIdIdx: index("Taggings_userId_feedId_idx").on(table.userId, table.feedId),
            bookmarkIdIdx: index("Taggings_bookmarkId_idx").on(table.bookmarkId),
        }
    });

export const twitterIntegration = mysqlTable("TwitterIntegration", {
    id: int("id").autoincrement().primaryKey().notNull(),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: datetime("updatedAt", { mode: 'string', fsp: 3 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    accessToken: varchar("accessToken", { length: 191 }),
    refreshToken: varchar("refreshToken", { length: 191 }),
    expiresIn: int("expiresIn").notNull(),
    twitterId: varchar("twitterId", { length: 191 }).notNull(),
},
    (table) => {
        return {
            userIdKey: uniqueIndex("TwitterIntegration_userId_key").on(table.userId),
            userIdIdx: index("TwitterIntegration_userId_idx").on(table.userId),
        }
    });

;

export const annotationTag = mysqlTable("annotation_tag", {
    tagId: int("tagId").notNull(),
    annotationId: varchar("annotationId", { length: 191 }).notNull(),
},
    (table) => {
        return {
            tagIdIdx: index("annotation_tag_tagId_idx").on(table.tagId),
            annotationIdIdx: index("annotation_tag_annotationId_idx").on(table.annotationId),
            annotationTagTagIdAnnotationId: primaryKey(table.tagId, table.annotationId)
        }
    });

export const key = mysqlTable("key", {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    hashedPassword: varchar("hashed_password", { length: 191 }),
    userId: varchar("user_id", { length: 191 }).notNull(),
    primary: tinyint("primary").notNull(),
    expires: bigint("expires", { mode: "number" }),
},
    (table) => {
        return {
            idKey: uniqueIndex("key_id_key").on(table.id),
            userIdIdx: index("key_user_id_idx").on(table.userId),
        }
    });

export const session = mysqlTable("session", {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    userId: varchar("user_id", { length: 191 }).notNull(),
    idleExpires: bigint("idle_expires", { mode: "number" }).notNull(),
    activeExpires: bigint("active_expires", { mode: "number" }).notNull(),
},
    (table) => {
        return {
            idKey: uniqueIndex("session_id_key").on(table.id),
            userIdIdx: index("session_user_id_idx").on(table.userId),
        }
    });

export const user = mysqlTable("user", {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: datetime("updatedAt", { mode: 'string', fsp: 3 }).notNull(),
    email: varchar("email", { length: 191 }).notNull(),
    username: varchar("username", { length: 191 }).default('').notNull(),
    defaultStateId: int("default_state_id"),
    defaultArchiveId: int("default_archive_id"),
},
    (table) => {
        return {
            idKey: uniqueIndex("user_id_key").on(table.id),
            emailKey: uniqueIndex("user_email_key").on(table.email),
            usernameKey: uniqueIndex("user_username_key").on(table.username),
            defaultStateIdKey: uniqueIndex("user_default_state_id_key").on(table.defaultStateId),
        }
    });
