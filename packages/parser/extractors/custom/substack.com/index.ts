import type { CustomExtractor } from '../../types.js';

export const SubstackParser = {
	content: {
		clean: ['.image-link-expand', '.subscribe-widget'],
		selectors: ['.available-content'],
	},
	detectBySelector: ['link[href="https://substackcdn.com"]'],
	domain: '*.substack.com',
	extractorName: 'SubstackParser',
} satisfies CustomExtractor;
