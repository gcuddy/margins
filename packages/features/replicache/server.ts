import { Server, type ExtractMutations } from './framework.js';
import {
	Annotation,
	Bookmark,
	Entry,
	Pin,
	Subscription,
} from '../core/index.js';

export const server = new Server()
	.expose('bookmark_create', Bookmark.create)
	.expose('bookmark_update', Bookmark.update)
	.expose('entry_create', Entry.create)
	.expose('annotation_create', Annotation.create)
	.expose('pin_create', Pin.create)
	.expose('pin_remove', Pin.remove)
	.expose('subscription_create', Subscription.create);

export const queries = new Server()
	.expose('annotations_fromEntryId', Annotation.fromEntryId)
	.expose('bookmark_fromUrl', Bookmark.fromUrl)
	.expose('entry_fromUrl', Entry.fromUrl)
	.expose('subscription_fromUrl', Subscription.fromUrl);

export type ServerType = typeof server;
export type ServerMutations = ExtractMutations<ServerType>;

export type QueriesType = typeof queries;
export type Queries = ExtractMutations<QueriesType>;

export * from './pull.js';
export * from './push.js';
