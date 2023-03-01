import type { CustomExtractor } from '$lib/web-parser';

export const substackCom: CustomExtractor = {
	domain: '*.substack.com',
	content: [".body.markup"]
};
