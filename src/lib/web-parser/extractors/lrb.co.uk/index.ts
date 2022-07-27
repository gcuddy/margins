import type { CustomExtractor } from '$lib/web-parser';

export const LrbCoUkExtractor: CustomExtractor = {
	domain: 'LRB.co.uk',
	dek: {
		selectors: ['.article-heading-holder h2']
	}
};
