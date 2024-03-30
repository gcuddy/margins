import type { Bookmark, Entry } from '@margins/db/kysely/types';
import type { Selectable } from 'kysely';
import { Store } from '../replicache/svelte-store.js';

type BookmarkWithEntry = Selectable<Bookmark> & { entry: Selectable<Entry> };

export const LibraryStore = new Store()
	.$type<BookmarkWithEntry>()
	.scan('all', () => ['Bookmark'])
	.get((id: string) => ['Bookmark', id])
	.build();
