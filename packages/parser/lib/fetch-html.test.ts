import { describe, expect, test } from 'vitest';
import { getHtml } from './fetch-html.js';

describe('fetch-html', () => {
	test('should fetch html from a url', async () => {
		const html = await getHtml('https://example.com');

		expect(html).toMatch(/<!doctype html>/i);
	});
});
