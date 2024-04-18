import { parseArticle } from '../../../parse.js';

describe('adamtooze.substack.com', () => {
	test('https://adamtooze.substack.com/p/soft-slow-and-scarred-the-imfs-take', async () => {
		const article = await parseArticle({
			url: 'https://adamtooze.substack.com/p/soft-slow-and-scarred-the-imfs-take',
		});

		expect(article).toMatchObject({
			author: 'Adam Tooze',
			title:
				"Chartbook 275 Soft, slow and scarred - the IMF's take on the world economy in April 2024.",
		});
	});
});
