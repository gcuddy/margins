import * as CustomExtractors from '../extractors/custom/index.js';
import { Extractor } from '../extractors/generic/index.js';
import type {
	CustomExtractor,
	Extractor as TExtractor,
} from '../extractors/types.js';
import type { Document } from '../dom-parser.js';

export function lookupCustomExtractor(
	doc: Document,
	...domains: string[]
): CustomExtractor | undefined {
	const extractor = Object.values(CustomExtractors).find((extractor) => {
		const extractorDomains = Array.isArray(extractor.domain)
			? extractor.domain
			: [extractor.domain];
		const hasDomain = extractorDomains.some((domain) =>
			domains.includes(domain),
		);
		if (hasDomain) return true;
		if (!extractor.detectBySelector) return false;
		return extractor.detectBySelector.some(
			(selector) => !!doc.querySelector(selector),
		);
	});
	return extractor;
}

export function getExtractor(url: string, doc: Document): TExtractor {
	const parsedUrl = new URL(url);

	const { hostname } = parsedUrl;

	const baseDomain = hostname.split('.').slice(-2).join('.');

	const wildCardSubDomain = `*.${baseDomain}`;

	const customExtractor = lookupCustomExtractor(
		doc,
		hostname,
		wildCardSubDomain,
		baseDomain,
	);

	const extractor: TExtractor = customExtractor
		? {
				...Extractor,
				...customExtractor,
			}
		: Extractor;

	return extractor;
}
