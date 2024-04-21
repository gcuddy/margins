import type { CustomExtractor } from '../../types.js';

export const SubstackParser = {
	content: {
		clean: ['.image-link-expand', '.subscribe-widget'],
		selectors: ['.available-content'],
	},
	domain: '*.substack.com',
} satisfies CustomExtractor;
