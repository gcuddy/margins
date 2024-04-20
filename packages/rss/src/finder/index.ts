import type { Document, HTMLElement, Parser } from '@margins/parser';
import { getDomainName } from './utils.js';
export const RSS_MIME_TYPES = [
	'application/rss+xml',
	'application/atom+xml',
	'application/rdf+xml',
	'application/rss',
	'application/atom',
	'application/rdf',
	'text/rss+xml',
	'text/atom+xml',
	'text/rdf+xml',
	'text/rss',
	'text/atom',
	'text/rdf',
	// JSON Feed
	'application/feed+json',
];

export interface RssSource {
	name?: string;
	// type: 'rss' | 'atom' | 'json';
	url: string;
}

export async function findRSSFeeds(
	parser: Parser,
	{ html, url }: { html?: string; url: string },
) {
	if (!html) {
		html = await fetch(url).then((res) => res.text());
	}

	console.log({ html, url });

	return [...findRSS(parser.parse(html!)), ...(await guessRSSfromUrl(url))];
}

function findRSS(html: HTMLElement | Document) {
	const rssSources: RssSource[] = [];

	for (const type of RSS_MIME_TYPES) {
		const domain = getDomainName(html);
		for (const search of html.querySelectorAll(`*[type="${type}"]`)) {
			const title = search.getAttribute('title');
			const href = search.getAttribute('href');

			if (domain && href && title) {
				let url = '';
				try {
					new URL(href);
					url = href;
				} catch {
					url = new URL(href, domain).toString();
				}

				rssSources.push({
					name: title.trim(),
					url: url.trim(),
				});
			} else if (title && href) {
				rssSources.push({
					name: title.trim(),
					url: href.trim(),
				});
			}
		}
	}
	return rssSources;
}

function generateGuesses(url: string): string[] {
	const urls: string[] = [];
	const commonUrls = ['/feed', '/rss', '/rss.xml', '/feed.xml'];

	const { hostname, protocol } = new URL(url);
	for (const url of commonUrls) {
		urls.push(`${protocol}//${hostname}${url}`);
	}
	return urls;
}

async function guessRSSfromUrl(url: string): Promise<RssSource[]> {
	const rssFeed: RssSource[] = [];

	for (const guessUrl of generateGuesses(url)) {
		const request = await fetch(guessUrl, { method: 'HEAD' });
		if (request.status == 200) {
			const contentType = request.headers.get('content-type')?.toLowerCase();
			for (const type of RSS_MIME_TYPES) {
				if (contentType?.includes(type)) {
					rssFeed.push({
						name: new URL(guessUrl).hostname.trim(),
						url: guessUrl.trim(),
					});
				}
				break;
			}
		}
	}
	return rssFeed;
}
