-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migraitons
/*
CREATE TABLE `Annotation` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`body` mediumtext,
	`type` enum('bookmark','note','annotation','reply','document') NOT NULL,
	`private` tinyint NOT NULL DEFAULT 1,
	`target` json,
	`entryId` int,
	`parentId` varchar(191),
	`deleted` datetime(3),
	`userId` varchar(191) NOT NULL DEFAULT '',
	`sortOrder` double NOT NULL DEFAULT 0,
	`bookmarkId` int,
	`editedAt` datetime(3),
	`color` enum('Yellow','Blue','Green','Pink','Purple') NOT NULL DEFAULT 'Yellow',
	`contentData` json,
	`title` varchar(191),
	`chosenIcon` json
);

CREATE TABLE `Article` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`content` longtext,
	`textContent` longtext,
	`author` varchar(191),
	`private` tinyint NOT NULL DEFAULT 1,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`readProgress` double DEFAULT 0,
	`slug` varchar(191),
	`url` varchar(191),
	`siteName` varchar(191),
	`colorHash` varchar(191),
	`date` datetime(3),
	`image` text,
	`wordCount` int,
	`starred` tinyint NOT NULL DEFAULT 0,
	`css` varchar(191),
	`description` text,
	`wiki` varchar(191),
	`classification` varchar(191),
	`pdf` tinyint,
	`html` varchar(191),
	`readLater` tinyint NOT NULL DEFAULT 1,
	`bookmark` tinyint NOT NULL DEFAULT 0,
	`position` int NOT NULL DEFAULT 0,
	`trash` tinyint NOT NULL DEFAULT 0,
	`location` varchar(191) NOT NULL DEFAULT 'INBOX',
	`type` int NOT NULL DEFAULT 0,
	`userId` varchar(191) NOT NULL,
	`favoriteId` int
);

CREATE TABLE `AuthorizationKey` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`userId` varchar(191) NOT NULL
);

CREATE TABLE `Bookmark` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`uri` varchar(191),
	`entryId` int,
	`userId` varchar(191) NOT NULL,
	`sortOrder` int DEFAULT 0,
	`data` json,
	`stateId` int,
	`private` tinyint NOT NULL DEFAULT 1,
	`interactionId` int,
	`favoriteId` int,
	`deleted` datetime(3),
	`is_read` tinyint NOT NULL DEFAULT 0,
	`progress` double NOT NULL DEFAULT 0,
	`context` json,
	`screenshot` varchar(191),
	`source` varchar(191),
	`dueDate` datetime(3),
	`snoozedUntil` datetime(3),
	`originalUrl` varchar(191)
);

CREATE TABLE `Collection` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`name` varchar(191) NOT NULL,
	`private` tinyint NOT NULL DEFAULT 1,
	`icon` json,
	`userId` varchar(191) NOT NULL,
	`description` varchar(191),
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`contentData` json,
	`viewOptions` json
);

CREATE TABLE `CollectionItems` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`collectionId` int NOT NULL,
	`position` double NOT NULL DEFAULT 0,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`annotationId` varchar(191),
	`bookmarkId` int,
	`entryId` int,
	`note` varchar(191),
	`parentId` varchar(191),
	`type` enum('Entry','Annotation','Section','Collection') NOT NULL DEFAULT 'Entry',
	`title` varchar(191)
);

CREATE TABLE `ColorDescription` (
	`userId` varchar(191) NOT NULL,
	`color` enum('Yellow','Blue','Green','Pink','Purple') NOT NULL,
	`description` varchar(191)
);
ALTER TABLE `ColorDescription` ADD PRIMARY KEY(`userId`,`color`);

CREATE TABLE `Context` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`url` varchar(191),
	`description` varchar(191),
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`entryId` int,
	`feedId` int,
	`userId` varchar(191) NOT NULL
);

CREATE TABLE `ContextNode` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`name` varchar(191) NOT NULL,
	`url` varchar(191),
	`description` varchar(191),
	`userId` varchar(191) NOT NULL,
	`refers_to` varchar(191)
);

CREATE TABLE `Entry` (
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`author` varchar(191),
	`location` enum('inbox','soon','later','archive'),
	`title` varchar(2083),
	`type` enum('article','rss','pdf','epub','bookmark','image','video','tweet','audio','book','movie','tv','song','album','playlist','recipe','game','board_game') NOT NULL DEFAULT 'article',
	`updatedAt` datetime(3) NOT NULL,
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`uri` varchar(191),
	`html` longtext,
	`text` longtext,
	`image` varchar(2083),
	`guid` varchar(191),
	`wordCount` int,
	`siteName` varchar(191),
	`summary` varchar(255),
	`media` json,
	`published` datetime(3),
	`updated` datetime(3),
	`feedId` int,
	`original` json,
	`recipe` json,
	`podcastIndexId` bigint,
	`duration` int,
	`enclosureLength` int,
	`enclosureType` varchar(191),
	`enclosureUrl` varchar(2083),
	`googleBooksId` varchar(191),
	`tmdbId` int,
	`schemaOrg` json,
	`tmdbData` json,
	`screenshot` varchar(191),
	`extended` json,
	`youtubeId` varchar(191),
	`pageCount` int,
	`genres` varchar(191),
	`language` varchar(191),
	`publisher` varchar(191)
);

CREATE TABLE `EntryData` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`html` longtext,
	`text` longtext,
	`image` varchar(191),
	`wordCount` int,
	`summary` varchar(191),
	`published` datetime(3),
	`updated` datetime(3),
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`userId` varchar(191) NOT NULL,
	`data` json,
	`entryId` int NOT NULL,
	`custom` json
);

CREATE TABLE `EntryInteraction` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`is_read` tinyint DEFAULT 0,
	`progress` double DEFAULT 0,
	`finished` tinyint DEFAULT 0,
	`userId` varchar(191) NOT NULL,
	`last_viewed` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`last_annotated` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`last_interaction` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`entryId` int NOT NULL,
	`currentPage` int
);

CREATE TABLE `EntryMedia` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`url` varchar(191),
	`size` int,
	`duration` int,
	`type` varchar(191),
	`title` varchar(191),
	`documentDataId` int NOT NULL,
	`entryId` int
);

CREATE TABLE `EntryTag` (
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`tagId` int NOT NULL,
	`entryId` int NOT NULL,
	`userId` varchar(191) NOT NULL
);
ALTER TABLE `EntryTag` ADD PRIMARY KEY(`tagId`,`entryId`,`userId`);

CREATE TABLE `Favorite` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`userId` varchar(191) NOT NULL,
	`deleted` datetime(3),
	`tagId` int,
	`smartListId` int,
	`annotationId` varchar(191),
	`bookmarkId` int,
	`entryId` int,
	`feedId` int,
	`sortOrder` double DEFAULT 0,
	`folderName` varchar(191),
	`parentId` varchar(191),
	`type` enum('FOLDER','FAVORITE') NOT NULL DEFAULT 'FAVORITE',
	`collectionId` int
);

CREATE TABLE `Feed` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`itunes_id` varchar(191),
	`feedUrl` varchar(191),
	`title` varchar(191),
	`link` varchar(191),
	`creator` varchar(191),
	`description` text,
	`lastBuildDate` datetime(3),
	`imageUrl` text,
	`podcast` tinyint NOT NULL DEFAULT 0,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`active` tinyint NOT NULL DEFAULT 1,
	`velocity` int,
	`podcastIndexId` int,
	`lastParsed` datetime(3),
	`podcastIndexData` json,
	`guid` varchar(191),
	`itunesId` int
);

CREATE TABLE `InvitationCode` (
	`code` varchar(191) PRIMARY KEY NOT NULL,
	`used` tinyint NOT NULL DEFAULT 0,
	`ownerId` varchar(191) NOT NULL,
	`usedById` varchar(191)
);

CREATE TABLE `Log` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`entryId` int NOT NULL,
	`note` varchar(191),
	`userId` varchar(191) NOT NULL,
	`date` datetime(3) NOT NULL,
	`duration` int,
	`endingPage` int,
	`episode` int,
	`season` int,
	`startingPage` int
);

CREATE TABLE `Relation` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`type` enum('Related','SavedFrom') NOT NULL DEFAULT 'Related',
	`userId` varchar(191) NOT NULL,
	`entryId` int NOT NULL,
	`relatedEntryId` int NOT NULL
);

CREATE TABLE `SmartList` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`name` varchar(191) NOT NULL,
	`filter` json,
	`viewOptions` json,
	`conditions` json,
	`icon` json,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`description` varchar(191),
	`private` tinyint NOT NULL DEFAULT 1,
	`updatedAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`userId` varchar(191) NOT NULL DEFAULT ''
);

CREATE TABLE `State` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`name` varchar(191) NOT NULL,
	`color` varchar(191),
	`type` enum('inbox','soon','later','archive') NOT NULL,
	`position` double NOT NULL DEFAULT 0,
	`description` varchar(191),
	`userId` varchar(191) NOT NULL,
	`default` tinyint NOT NULL DEFAULT 0,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL
);

CREATE TABLE `Stylesheet` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`domain` varchar(191) NOT NULL,
	`css` mediumtext NOT NULL,
	`userEntryId` int,
	`userId` varchar(191) NOT NULL
);

CREATE TABLE `Subscription` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`feedId` int NOT NULL,
	`userId` varchar(191) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`title` varchar(191) NOT NULL,
	`download_full` tinyint NOT NULL DEFAULT 0
);

CREATE TABLE `Tag` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`name` varchar(191) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`viewOptions` json,
	`userId` varchar(191) NOT NULL
);

CREATE TABLE `TagOnEntry` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`tagId` int NOT NULL,
	`entryId` int NOT NULL,
	`userId` varchar(191) NOT NULL
);

CREATE TABLE `Taggings` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`tagId` int NOT NULL,
	`userId` varchar(191) NOT NULL,
	`feedId` int,
	`bookmarkId` int
);

CREATE TABLE `TwitterIntegration` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`userId` varchar(191) NOT NULL,
	`accessToken` varchar(191),
	`refreshToken` varchar(191),
	`expiresIn` int NOT NULL,
	`twitterId` varchar(191) NOT NULL
);

CREATE TABLE `UserEntry` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL
);

CREATE TABLE `_AnnotationToTag` (
	`A` varchar(191) NOT NULL,
	`B` int NOT NULL
);
ALTER TABLE `_AnnotationToTag` ADD PRIMARY KEY(`A`,`B`);

CREATE TABLE `_EntryToTag` (
	`A` int NOT NULL,
	`B` int NOT NULL
);
ALTER TABLE `_EntryToTag` ADD PRIMARY KEY(`A`,`B`);

CREATE TABLE `_SubscriptionToTag` (
	`A` int NOT NULL,
	`B` int NOT NULL
);
ALTER TABLE `_SubscriptionToTag` ADD PRIMARY KEY(`A`,`B`);

CREATE TABLE `_UserFollows` (
	`A` varchar(191) NOT NULL,
	`B` varchar(191) NOT NULL
);
ALTER TABLE `_UserFollows` ADD PRIMARY KEY(`A`,`B`);

CREATE TABLE `annotation_tag` (
	`tagId` int NOT NULL,
	`annotationId` varchar(191) NOT NULL
);
ALTER TABLE `annotation_tag` ADD PRIMARY KEY(`tagId`,`annotationId`);

CREATE TABLE `key` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`hashed_password` varchar(191),
	`user_id` varchar(191) NOT NULL,
	`primary` tinyint NOT NULL,
	`expires` bigint
);

CREATE TABLE `session` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`user_id` varchar(191) NOT NULL,
	`idle_expires` bigint NOT NULL,
	`active_expires` bigint NOT NULL DEFAULT 0
);

CREATE TABLE `user` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`email` varchar(191) NOT NULL,
	`username` varchar(191) NOT NULL DEFAULT '',
	`default_state_id` int,
	`default_archive_id` int
);

CREATE INDEX Annotation_entryId_idx ON Annotation (`entryId`);
CREATE INDEX Annotation_userId_idx ON Annotation (`userId`);
CREATE INDEX Annotation_parentId_idx ON Annotation (`parentId`);
CREATE INDEX Annotation_bookmarkId_idx ON Annotation (`bookmarkId`);
CREATE UNIQUE INDEX Article_userId_url_key ON Article (`userId`,`url`);
CREATE INDEX Article_userId_idx ON Article (`userId`);
CREATE UNIQUE INDEX AuthorizationKey_userId_key ON AuthorizationKey (`userId`);
CREATE INDEX AuthorizationKey_userId_idx ON AuthorizationKey (`userId`);
CREATE UNIQUE INDEX Bookmark_interactionId_key ON Bookmark (`interactionId`);
CREATE UNIQUE INDEX Bookmark_uri_entryId_userId_key ON Bookmark (`uri`,`entryId`,`userId`);
CREATE INDEX Bookmark_uri_idx ON Bookmark (`uri`);
CREATE INDEX Bookmark_userId_idx ON Bookmark (`userId`);
CREATE INDEX Bookmark_stateId_idx ON Bookmark (`stateId`);
CREATE INDEX Bookmark_interactionId_stateId_uri_idx ON Bookmark (`interactionId`,`stateId`,`uri`);
CREATE INDEX Bookmark_userId_stateId_idx ON Bookmark (`userId`,`stateId`);
CREATE INDEX Bookmark_uri_entryId_idx ON Bookmark (`uri`,`entryId`);
CREATE UNIQUE INDEX Collection_userId_name_key ON Collection (`userId`,`name`);
CREATE INDEX Collection_userId_idx ON Collection (`userId`);
CREATE UNIQUE INDEX CollectionItems_annotationId_key ON CollectionItems (`annotationId`);
CREATE UNIQUE INDEX CollectionItems_collectionId_annotationId_key ON CollectionItems (`collectionId`,`annotationId`);
CREATE UNIQUE INDEX CollectionItems_collectionId_entryId_key ON CollectionItems (`collectionId`,`entryId`);
CREATE UNIQUE INDEX CollectionItems_collectionId_bookmarkId_key ON CollectionItems (`collectionId`,`bookmarkId`);
CREATE INDEX CollectionItems_collectionId_idx ON CollectionItems (`collectionId`);
CREATE INDEX CollectionItems_bookmarkId_idx ON CollectionItems (`bookmarkId`);
CREATE INDEX CollectionItems_entryId_idx ON CollectionItems (`entryId`);
CREATE INDEX CollectionItems_parentId_idx ON CollectionItems (`parentId`);
CREATE INDEX ColorDescription_userId_idx ON ColorDescription (`userId`);
CREATE INDEX Context_userId_idx ON Context (`userId`);
CREATE INDEX Context_entryId_idx ON Context (`entryId`);
CREATE INDEX Context_feedId_idx ON Context (`feedId`);
CREATE INDEX ContextNode_userId_idx ON ContextNode (`userId`);
CREATE UNIQUE INDEX Entry_podcastIndexId_key ON Entry (`podcastIndexId`);
CREATE UNIQUE INDEX Entry_googleBooksId_key ON Entry (`googleBooksId`);
CREATE UNIQUE INDEX Entry_tmdbId_key ON Entry (`tmdbId`);
CREATE UNIQUE INDEX Entry_youtubeId_key ON Entry (`youtubeId`);
CREATE UNIQUE INDEX Entry_uri_key ON Entry (`uri`);
CREATE UNIQUE INDEX Entry_uri_id_key ON Entry (`uri`,`id`);
CREATE INDEX Entry_feedId_idx ON Entry (`feedId`);
CREATE INDEX Entry_id_published_createdAt_idx ON Entry (`id`,`published`,`createdAt`);
CREATE INDEX Entry_text_idx ON Entry (`text`);
CREATE INDEX Entry_text_title_author_idx ON Entry (`text`,`title`,`author`);
CREATE INDEX Entry_title_author_idx ON Entry (`title`,`author`);
CREATE UNIQUE INDEX EntryData_entryId_key ON EntryData (`entryId`);
CREATE UNIQUE INDEX EntryData_entryId_userId_key ON EntryData (`entryId`,`userId`);
CREATE INDEX EntryData_entryId_idx ON EntryData (`entryId`);
CREATE INDEX EntryData_userId_idx ON EntryData (`userId`);
CREATE UNIQUE INDEX EntryInteraction_userId_entryId_key ON EntryInteraction (`userId`,`entryId`);
CREATE INDEX EntryInteraction_userId_idx ON EntryInteraction (`userId`);
CREATE INDEX EntryInteraction_entryId_idx ON EntryInteraction (`entryId`);
CREATE INDEX EntryMedia_documentDataId_idx ON EntryMedia (`documentDataId`);
CREATE INDEX EntryMedia_entryId_idx ON EntryMedia (`entryId`);
CREATE INDEX EntryTag_tagId_idx ON EntryTag (`tagId`);
CREATE INDEX EntryTag_entryId_idx ON EntryTag (`entryId`);
CREATE INDEX EntryTag_userId_idx ON EntryTag (`userId`);
CREATE UNIQUE INDEX Favorite_tagId_key ON Favorite (`tagId`);
CREATE UNIQUE INDEX Favorite_annotationId_key ON Favorite (`annotationId`);
CREATE UNIQUE INDEX Favorite_bookmarkId_key ON Favorite (`bookmarkId`);
CREATE UNIQUE INDEX Favorite_userId_entryId_key ON Favorite (`userId`,`entryId`);
CREATE UNIQUE INDEX Favorite_collectionId_key ON Favorite (`collectionId`);
CREATE UNIQUE INDEX Favorite_userId_annotationId_key ON Favorite (`userId`,`annotationId`);
CREATE UNIQUE INDEX Favorite_userId_collectionId_key ON Favorite (`userId`,`collectionId`);
CREATE UNIQUE INDEX Favorite_userId_bookmarkId_key ON Favorite (`userId`,`bookmarkId`);
CREATE UNIQUE INDEX Favorite_userId_tagId_key ON Favorite (`userId`,`tagId`);
CREATE UNIQUE INDEX Favorite_userId_feedId_key ON Favorite (`userId`,`feedId`);
CREATE UNIQUE INDEX Favorite_userId_smartListId_key ON Favorite (`userId`,`smartListId`);
CREATE INDEX Favorite_userId_idx ON Favorite (`userId`);
CREATE INDEX Favorite_tagId_idx ON Favorite (`tagId`);
CREATE INDEX Favorite_smartListId_idx ON Favorite (`smartListId`);
CREATE INDEX Favorite_bookmarkId_idx ON Favorite (`bookmarkId`);
CREATE INDEX Favorite_annotationId_idx ON Favorite (`annotationId`);
CREATE INDEX Favorite_feedId_idx ON Favorite (`feedId`);
CREATE INDEX Favorite_entryId_idx ON Favorite (`entryId`);
CREATE INDEX Favorite_collectionId_idx ON Favorite (`collectionId`);
CREATE INDEX Favorite_parentId_idx ON Favorite (`parentId`);
CREATE UNIQUE INDEX Feed_feedUrl_key ON Feed (`feedUrl`);
CREATE UNIQUE INDEX Feed_itunes_id_key ON Feed (`itunes_id`);
CREATE UNIQUE INDEX Feed_podcastIndexId_key ON Feed (`podcastIndexId`);
CREATE UNIQUE INDEX Feed_itunesId_key ON Feed (`itunesId`);
CREATE INDEX Feed_podcastIndexId_idx ON Feed (`podcastIndexId`);
CREATE UNIQUE INDEX InvitationCode_usedById_key ON InvitationCode (`usedById`);
CREATE INDEX InvitationCode_ownerId_idx ON InvitationCode (`ownerId`);
CREATE UNIQUE INDEX Log_userId_entryId_date_key ON Log (`userId`,`entryId`,`date`);
CREATE INDEX Log_entryId_idx ON Log (`entryId`);
CREATE INDEX Log_userId_idx ON Log (`userId`);
CREATE UNIQUE INDEX Relation_userId_entryId_relatedEntryId_key ON Relation (`userId`,`entryId`,`relatedEntryId`);
CREATE INDEX Relation_userId_idx ON Relation (`userId`);
CREATE INDEX Relation_entryId_idx ON Relation (`entryId`);
CREATE INDEX Relation_relatedEntryId_idx ON Relation (`relatedEntryId`);
CREATE INDEX Relation_userId_entryId_idx ON Relation (`userId`,`entryId`);
CREATE UNIQUE INDEX SmartList_userId_name_key ON SmartList (`userId`,`name`);
CREATE INDEX SmartList_userId_idx ON SmartList (`userId`);
CREATE INDEX State_userId_idx ON State (`userId`);
CREATE INDEX Stylesheet_userEntryId_idx ON Stylesheet (`userEntryId`);
CREATE INDEX Stylesheet_userId_idx ON Stylesheet (`userId`);
CREATE UNIQUE INDEX Subscription_userId_feedId_key ON Subscription (`userId`,`feedId`);
CREATE INDEX Subscription_userId_idx ON Subscription (`userId`);
CREATE INDEX Subscription_feedId_idx ON Subscription (`feedId`);
CREATE UNIQUE INDEX Tag_name_userId_key ON Tag (`name`,`userId`);
CREATE INDEX Tag_userId_idx ON Tag (`userId`);
CREATE UNIQUE INDEX TagOnEntry_tagId_entryId_userId_key ON TagOnEntry (`tagId`,`entryId`,`userId`);
CREATE INDEX TagOnEntry_tagId_idx ON TagOnEntry (`tagId`);
CREATE INDEX TagOnEntry_entryId_idx ON TagOnEntry (`entryId`);
CREATE INDEX TagOnEntry_userId_idx ON TagOnEntry (`userId`);
CREATE UNIQUE INDEX Taggings_feedId_userId_tagId_key ON Taggings (`feedId`,`userId`,`tagId`);
CREATE UNIQUE INDEX Taggings_bookmarkId_userId_tagId_key ON Taggings (`bookmarkId`,`userId`,`tagId`);
CREATE INDEX Taggings_userId_idx ON Taggings (`userId`);
CREATE INDEX Taggings_tagId_idx ON Taggings (`tagId`);
CREATE INDEX Taggings_feedId_idx ON Taggings (`feedId`);
CREATE INDEX Taggings_userId_tagId_idx ON Taggings (`userId`,`tagId`);
CREATE INDEX Taggings_userId_feedId_idx ON Taggings (`userId`,`feedId`);
CREATE INDEX Taggings_bookmarkId_idx ON Taggings (`bookmarkId`);
CREATE UNIQUE INDEX TwitterIntegration_userId_key ON TwitterIntegration (`userId`);
CREATE INDEX TwitterIntegration_userId_idx ON TwitterIntegration (`userId`);
CREATE UNIQUE INDEX _AnnotationToTag_AB_unique ON _AnnotationToTag (`A`,`B`);
CREATE INDEX _AnnotationToTag_B_index ON _AnnotationToTag (`B`);
CREATE UNIQUE INDEX _EntryToTag_AB_unique ON _EntryToTag (`A`,`B`);
CREATE INDEX _EntryToTag_B_index ON _EntryToTag (`B`);
CREATE UNIQUE INDEX _SubscriptionToTag_AB_unique ON _SubscriptionToTag (`A`,`B`);
CREATE INDEX _SubscriptionToTag_B_index ON _SubscriptionToTag (`B`);
CREATE UNIQUE INDEX _UserFollows_AB_unique ON _UserFollows (`A`,`B`);
CREATE INDEX _UserFollows_B_index ON _UserFollows (`B`);
CREATE INDEX annotation_tag_tagId_idx ON annotation_tag (`tagId`);
CREATE INDEX annotation_tag_annotationId_idx ON annotation_tag (`annotationId`);
CREATE UNIQUE INDEX key_id_key ON key (`id`);
CREATE INDEX key_user_id_idx ON key (`user_id`);
CREATE UNIQUE INDEX session_id_key ON session (`id`);
CREATE INDEX session_user_id_idx ON session (`user_id`);
CREATE UNIQUE INDEX user_id_key ON user (`id`);
CREATE UNIQUE INDEX user_email_key ON user (`email`);
CREATE UNIQUE INDEX user_username_key ON user (`username`);
CREATE UNIQUE INDEX user_default_state_id_key ON user (`default_state_id`);
*/