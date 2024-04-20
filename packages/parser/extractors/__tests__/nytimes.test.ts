import { parseArticle } from '../../index.js';

describe('nytimes fetching + parsing tests', () => {
	test('https://www.nytimes.com/2024/04/17/world/middleeast/iran-israel-attack.html', async () => {
		const article = await parseArticle({
			url: 'https://www.nytimes.com/2024/04/17/world/middleeast/iran-israel-attack.html',
		});
		expect(article.html).toBeTruthy();
		expect(article).toMatchObject({
			title:
				'Miscalculation Led to Escalation in Clash Between Israel and Iran',
		});
	});
});
