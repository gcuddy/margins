import { parseArticle } from '../../index.js';

describe('generic extractor tests', () => {
	test('matthew strom', async () => {
		// TODO: leaving another note here that the html for these should be downloaded as fixtures
		const url =
			'https://matthewstrom.com/writing/generating-color-palettes/#in-practice%3A-crafting-colors-with-functions';
		const article = await parseArticle({ url });

		const regex = /Matthew Str[oö]m/;

		expect(article.author).toMatch(regex);
		expect(article.title).toMatch(
			'How to generate color palettes for design systems',
		);

		// expect(article).toMatchObject({
		// 	title: 'How to generate color palettes for design systems',
		// });
	});

	test('noema', async () => {
		const url = `https://www.noemamag.com/we-need-to-rewild-the-internet/`;
		const article = await parseArticle({ url });

		const title = 'We Need To Rewild The Internet';
		expect(article.title).toBe(title);
		expect(article.image).toContain('noema_pillar_growth_004.jpg');

		//TODO: test content
	});
});
