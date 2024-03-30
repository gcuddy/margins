import { Server } from './framework.js';
import * as Bookmark from '../core/bookmark/index.js';
export const server = new Server().expose('bookmark_create', Bookmark.create);

export type ServerType = typeof server;
