import { parse } from 'node-html-parser';
import { extractFromMeta } from './dom.js';

describe('meta tags test', () => {
	const html = `<html>
  <head>
<meta name="description" content="foo">
<meta property="og:title" content="foo">
</head></html>`;
	const doc = parse(html);

	test('able to parse basic meta tags', () => {
		expect(extractFromMeta(doc, ['description'])).toBe('foo');
	});
	test('parsing open graph tags', () => {
		expect(extractFromMeta(doc, ['og:title'])).toBe('foo');
	});
});
