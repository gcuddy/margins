import { parseArticle } from '../../index.js';

describe('generic extractor tests', () => {
	test('matthew strom', async () => {
		const url =
			'https://matthewstrom.com/writing/generating-color-palettes/#in-practice%3A-crafting-colors-with-functions';
		const article = await parseArticle({ url });

		expect(article).toMatchObject({
			author: 'Matthew Strom',
			title: 'How to generate color palettes for design systems',
		});
	});
});
