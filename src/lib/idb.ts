import { browser } from '$app/environment';
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { z } from 'zod';
import type { RssFeedItemModel } from './types/schemas/prisma';

interface MarginsDb extends DBSchema {
	feedItems: {
		key: string;
		value: z.infer<typeof RssFeedItemModel>;
		indexes: {
			uuid: string;
			rssFeedId: number;
		};
	};
}
let db: IDBPDatabase<MarginsDb>;

if (browser) {
	openDB<MarginsDb>('margins', 1, {
		upgrade(db) {
			const feedItemsStore = db.createObjectStore('feedItems', {
				keyPath: 'uuid',
			});
			feedItemsStore.createIndex('uuid', 'uuid', { unique: true });
			feedItemsStore.createIndex('rssFeedId', 'rssFeedId', { unique: false });
		},
	}).then((_db) => {
		db = _db;
	});
}

export default db;
