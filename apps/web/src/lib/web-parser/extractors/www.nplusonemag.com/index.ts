import type { CustomExtractor } from '$lib/web-parser';

export const wwwNplusonemagCom: CustomExtractor = {
	domain: 'www.nplusonemag.com',
	author: {
		selectors: ['section#content .post-author']
	},
	excerpt: {
		selectors: ['.post-dek']
	},
	title: {
		selectors: ['section#content .post-title']
	}
};
