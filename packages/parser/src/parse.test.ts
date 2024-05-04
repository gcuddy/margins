import { parseArticle } from './index.js';

describe('parse tests', () => {
	test('https://www.theborderchronicle.com/p/bridges-or-barricades-debates-in', async () => {
		const article = await parseArticle({
			url: 'https://www.theborderchronicle.com/p/bridges-or-barricades-debates-in',
		});
		expect(article).not.toBeNull();

		expect(article.title).toBe(
			'Bridges or Barricades? Debates in the Time of Elections',
		);
		expect(article.author).toBe('Todd Miller');
	});
});
