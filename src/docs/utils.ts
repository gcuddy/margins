import { error } from '@sveltejs/kit';
import type { DocResolver } from './types';

export async function getDoc(slug: string) {
	// via https://github.dev/melt-ui/melt-ui/blob/develop/src/docs/utils/index.ts
	const modules = import.meta.glob('/src/docs/content/**/*.md');
	let match: { path?: string; resolver?: DocResolver } = {};

	for (const [path, resolver] of Object.entries(modules)) {
		if (slugFromPath(path) === slug) {
			match = { path, resolver: resolver as unknown as DocResolver };
			break;
		}
	}

	const doc = await match?.resolver?.();

	if (!doc || !doc.metadata) {
		throw error(404);
	}
	return doc;
}

function slugFromPath(path: string) {
	return path.replace('/src/docs/content/', '').replace('.md', '');
}
