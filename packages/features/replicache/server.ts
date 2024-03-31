import { Server } from './framework.js';
import { Annotation, Bookmark } from '../core/index.js';
export const server = new Server()
	.expose('bookmark_create', Bookmark.create)
	.expose('annotation_create', Annotation.create);

export type ServerType = typeof server;
