// TODO: copy over logic from old parse.ts, which includes parsing spotify, youtube, books, etc.
import type { Entry } from '@margins/db/kysely/types';
// import { Parser } from '@margins/parser';
import type { Insertable } from 'kysely';

type EntryInput = Omit<Insertable<Entry>, 'updatedAt'>;

class Parser {
	url: string;

	constructor(url: string) {
		this.url = url;
	}

	async parse() {
		const parsed = {
			title: 'title',
			type: 'article',
			url: this.url,
		};

		return parsed;
	}
}

export async function parseUrlToEntry(url: string): Promise<EntryInput> {
	const parser = new Parser(url);
	const { type: _, ...parsed } = await parser.parse();
	console.log({ parsed });

	const entry = {
		...parsed,
		type: 'article',
	} satisfies EntryInput;

	return entry;
}
