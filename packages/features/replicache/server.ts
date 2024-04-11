import { Server } from './framework.js';
import { Annotation, Bookmark, Pin } from '../core/index.js';
export const server = new Server()
	.expose('bookmark_create', Bookmark.create)
	.expose('bookmark_update', Bookmark.update)
	.expose('annotation_create', Annotation.create)
	.expose('pin_create', Pin.create)
	.expose('pin_remove', Pin.remove);

export type ServerType = typeof server;
