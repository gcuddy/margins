import { normalizeTimezone } from '$lib/utils/date';

import type { PageData } from './$types';

export function makeTimeline(data: PageData) {
	if (!data.entry?.bookmark) {
		return null;
	}

	// get saved date
	const savedAt = new Date(
		// @ts-expect-error - TODO: this is actually a string, but our type system thinks it's a Date
		normalizeTimezone(data.entry.bookmark.createdAt),
	);
}
