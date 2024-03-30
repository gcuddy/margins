// TODO: copy over logic from old parse.ts, which includes parsing spotify, youtube, books, etc.
import type { Entry } from '@margins/db/kysely/types';
import { parseArticle } from '@margins/parser';
import type { Insertable } from 'kysely';

type EntryInput = Omit<Insertable<Entry>, 'updatedAt' | 'id'>;

// class Parser {
// 	url: string;

// 	constructor(url: string) {
// 		this.url = url;
// 	}

// 	async parse() {
// 		const parsed = {
// 			title: 'title',
// 			type: 'article',
// 			uri: this.url,
// 		};

// 		return parsed;
// 	}
// }

export async function parseUrlToEntry(url: string): Promise<EntryInput> {
	const { url: _, ...parsed } = await parseArticle({ url });
	// const parsed = {};

	const entry: EntryInput = {
		...parsed,
		type: 'article',
		uri: url,
	};

	return entry;
}
