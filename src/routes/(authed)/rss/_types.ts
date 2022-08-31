import type Parser from 'rss-parser';

export interface Enclosure {
	url: string;
	length?: number;
	type?: string;
}

export interface Item {
	link?: string;
	guid?: string;
	title?: string;
	pubDate?: string;
	creator?: string;
	summary?: string;
	content?: string;
	isoDate?: string;
	categories?: string[];
	contentSnippet?: string;
	enclosure?: Enclosure;
}

export interface PaginationLinks {
	self?: string;
	first?: string;
	next?: string;
	last?: string;
	prev?: string;
}

export interface Output {
	image?: {
		link?: string;
		url: string;
		title?: string;
	};
	paginationLinks?: PaginationLinks;
	link?: string;
	title?: string;
	items: Item[];
	feedUrl?: string;
	description?: string;
	itunes?: {
		[key: string]: any;
		image?: string;
		owner?: {
			name?: string;
			email?: string;
		};
		author?: string;
		summary?: string;
		explicit?: string;
		categories?: string[];
		keywords?: string[];
	};
}

export type RSSParserOutput = Parser.Item | Parser.Item[];
