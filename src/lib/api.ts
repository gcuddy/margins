import { post } from './utils';

export const updateTagsOnArticles = async (articleIds: number[], tags: string[]) => {
	return post('/api/tag', {
		ids: articleIds,
		tags,
	});
};
