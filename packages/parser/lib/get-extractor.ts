import * as CustomExtractors from '../extractors/custom/index.js';
import { Extractor } from '../extractors/generic/index.js';
import type {
	CustomExtractor,
	Extractor as TExtractor,
} from '../extractors/types.js';

export function lookupCustomExtractor(
	...names: string[]
): CustomExtractor | null {
	for (const name of names) {
		if (name in CustomExtractors) {
			return CustomExtractors[name as keyof typeof CustomExtractors];
		}
	}
	return null;
}

export function getExtractors(url: string): TExtractor {
	const parsedUrl = new URL(url);

	const { hostname } = parsedUrl;

	const baseDomain = hostname.split('.').slice(-2).join('.');

	const wildCardSubDomain = `*${baseDomain}`;

	const customExtractor = lookupCustomExtractor(
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
