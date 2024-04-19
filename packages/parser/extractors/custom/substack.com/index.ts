import type { CustomExtractor } from '../../types.js';

export const SubstackParser: CustomExtractor = {
	content: {
		selectors: ['.available-content'],
	},
	domain: '*.substack.com',
};
