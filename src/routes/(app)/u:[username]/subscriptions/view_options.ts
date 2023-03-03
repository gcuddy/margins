import type { ViewOptions } from "$lib/types/schemas/View";

export const DEFAULT_RSS_VIEW_OPTIONS: ViewOptions = {
	view: "list",
	sort: "published",
	properties: {
		author: false,
		site: false,
		description: true,
		tags: true,
		wordCount: false,
		date: true,
		image: false,
		readProgress: true,
		location: false,
		pageNote: false,
		url: false,
		annotationCount: true,
	},
};
