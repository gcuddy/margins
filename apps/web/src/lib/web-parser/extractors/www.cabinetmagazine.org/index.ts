import type { CustomExtractor } from '$lib/web-parser';

export const wwwCabinetmagazineOrg: CustomExtractor = {
	domain: ['www.cabinetmagazine.org', 'cabinetmagazine.org'],
    content: {
        selectors: [".issue-content.copy"],
        clean: ['.title']
    }
}
