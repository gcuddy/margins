import { parse } from 'node-html-parser';
import { extractAuthor } from './index.js';

describe('extract author tests', () => {
	const html = `<html><head>
<meta property="og:article:author" content="John Doe">
</head</html>
`;
	const doc = parse(html);
	test('extract author meta tags', () => {
		expect(extractAuthor(doc)).toBe('John Doe');
	});
});
