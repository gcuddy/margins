import { parse } from 'node-html-parser';
import { SubstackParser } from '../extractors/custom/index.js';
import { getHtml } from './fetch-html.js';
import { getExtractor } from './get-extractor.js';

describe('get extractor tests', () => {
	test('wildcard domain', async () => {
		const url =
			'https://adamtooze.substack.com/p/chartbook-245-gaza-beyond-de-development';

		const html = await getHtml(url);
		const doc = parse(html);
		const extractor = getExtractor(url, doc);

		expect(extractor.extractorName).toEqual(SubstackParser.extractorName);
	});

	test('substack extractor for non-substack domain', async () => {
		const url =
			'https://www.theborderchronicle.com/p/can-president-biden-really-shut-down';
		// TODO: download as fixture
		const html = await getHtml(url);
		const doc = parse(html);
		const extractor = getExtractor(url, doc);

		// check we got the substack extractor
		expect(extractor.extractorName).toEqual(SubstackParser.extractorName);
	});
});
