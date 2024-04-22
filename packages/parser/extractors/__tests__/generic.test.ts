import { parseArticle } from '../../index.js';

describe('generic extractor tests', () => {
	test('matthew strom', async () => {
		const url =
			'https://matthewstrom.com/writing/generating-color-palettes/#in-practice%3A-crafting-colors-with-functions';
		const article = await parseArticle({ url });

		const regex = /Matthew Str[oö]m/;

		expect(article.author).toMatch(regex);

		// expect(article).toMatchObject({
		// 	title: 'How to generate color palettes for design systems',
		// });
	});
});
