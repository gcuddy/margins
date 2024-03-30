import type { Bookmark } from '@margins/db/kysely/types.js';
import type { Selectable } from 'kysely';
import { Store } from '../replicache/svelte-store.js';

export const LibraryStore = new Store()
	.$type<Selectable<Bookmark>>()
	.scan('list', () => ['Bookmark'])
	.get((id: string) => ['Bookmark', id])
	.build();
