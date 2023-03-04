import type { CustomExtractor } from '$lib/web-parser';

export const substackCom: CustomExtractor = {
	domain: "*.substack.com",
	content: [".body.markup"],
    enclosureUrl: [[".podcast-embed ~ audio[src]", "src"]],
    type:[['.podcast-embed ~ audio[src]', 'audio'], "article"],

};
