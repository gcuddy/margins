import * as CustomExtractors from '../extractors/custom/index.js';
import { Extractor } from '../extractors/generic/index.js';
import type {
	CustomExtractor,
	Extractor as TExtractor,
} from '../extractors/types.js';

export function lookupCustomExtractor(
	...domains: string[]
): CustomExtractor | undefined {
	const extractor = Object.values(CustomExtractors).find((extractor) => {
		const extractorDomains = Array.isArray(extractor.domain)
			? extractor.domain
			: [extractor.domain];
		return extractorDomains.some((domain) => domains.includes(domain));
	});
	return extractor;
}

export function getExtractor(url: string): TExtractor {
	const parsedUrl = new URL(url);

	const { hostname } = parsedUrl;

	const baseDomain = hostname.split('.').slice(-2).join('.');

	const wildCardSubDomain = `*.${baseDomain}`;

	const customExtractor = lookupCustomExtractor(
		hostname,
		wildCardSubDomain,
		baseDomain,
	);

	console.log({ customExtractor });

	const extractor: TExtractor = customExtractor
		? {
				...Extractor,
				...customExtractor,
			}
		: Extractor;

	return extractor;
}
