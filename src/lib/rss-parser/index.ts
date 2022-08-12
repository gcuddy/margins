// import { isJson, isXml } from 'src/routes/rss/_rss-utils';

import { XMLParser } from 'fast-xml-parser';
const parser = new XMLParser({
	ignoreAttributes: false,
	attributeNamePrefix: '@_',
	ignoreDeclaration: true,
	ignorePiTags: true
});

interface FeedItem {
	title: string;
	content: string;
	contentSnippet: string;
	creator: string;
	link: string;
	pubDate: string;
	author: string;
	uuid: string;
}

interface Feed {
	title: string;
	feedUrl: string;
	link: string;
	favicon: string;
	description: string;
	imageUrl: string;
	items: FeedItem[];
}

function getText(node: any) {
	if (node['#text']) {
		return node['#text'];
	} else if (node.children) {
		return node.children.map(getText).join('');
	} else {
		return node;
	}
}

// todo: add z schema validation
function parseAtomFeed(feed: any): Feed {
	const feeds: FeedUrl[] = [];
	for (const entry of feed.feed.entry) {
		const link = entry.link[0];
		const title = entry.title[0];
		const url = link.attributes.href;
		feeds.push({
			url,
			title
		});
	}
	// return {
	//   title: getText(feed.title),
	//   feedUrl:
	// };
}

function parseXml(xml: string) {
	const parsedXml = parser.parse(xml);
	if (parsedXml.feed) {
		// then we're parsing atom
		return parseAtomFeed(parsedXml);
	}
}

export async function parse(url: string) {
	const res = await fetch(url);
	const text = await res.text();
	if (isXml(text)) {
		return parseXml(text);
	} else if (isJson(text)) {
		// todo
	}
}
