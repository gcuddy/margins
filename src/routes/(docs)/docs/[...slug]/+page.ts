import type { DocFile } from '$docs/types';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		// This is breaking rn...
		const module: DocFile = await import(
			`../../../../docs/content/${params.slug}.md`
		);

		return {
			content: module.default,
			metadata: module.metadata,
		};
		// getDoc(params.slug);
	} catch (e) {
		throw error(404, `Could not find ${params.slug}`);
	}
}
