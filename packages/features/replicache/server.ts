import { Server } from './framework';
import * as Bookmark from '../core/bookmark';
export const server = new Server().expose('bookmark_create', Bookmark.create);

export type ServerType = typeof server;
