import type JSONFeed from '@json-feed-types/1_1';

export function isJsonFeed(json: any): json is JSONFeed {
	return (
		json &&
		typeof json === 'object' &&
		'version' in json &&
		typeof json.version === 'string' &&
		json.version.startsWith('https://jsonfeed.org/version/') &&
		'items' in json &&
		Array.isArray(json.items)
	);
}

export function assertsJsonFeed(json: any): asserts json is JSONFeed {
	if (!isJsonFeed(json)) {
		throw new Error('Not a JSON Feed');
	}
}
