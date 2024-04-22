import type { Extractor as ExtractorType } from '../types.js';
import { findAuthor } from './author.js';
import type { HTMLElement } from 'node-html-parser';

export const Extractor: ExtractorType = {
	author: [
		{ meta: ['author', 'og:author', 'citation_author'] },
		'.authors-byline',
		{
			meta: [
				'dc:creator',
				'dcterm:creator',
				'twitter:creator',
				'weibo:article:user_id',
				'weibo:webpage:user_id',
			],
		},
		(el: HTMLElement) => findAuthor(el) || '',
	],
	date_published: [
		{ meta: ['article:published_time', 'date', 'dc:date', 'dcterm:date'] },
		['time[itemprop="datePublished"]', 'datetime'],
	],
	dek: [
		{
			meta: [
				'twitter:description',
				'dc:description',
				'dcterm:description',
				'og:description',
				'description',
				'weibo:article:description',
				'weibo:webpage:description',
			],
		},
	],
	disableJSONLD: false,
	excerpt: [
		{
			meta: [
				'twitter:description',
				'dc:description',
				'dcterm:description',
				'og:description',
				'description',
				'weibo:article:description',
				'weibo:webpage:description',
			],
		},
	],
	extractorName: 'GenericExtractor',
	lead_image_url: [
		{
			meta: [
				// in order of priority
				'og:image',
				'twitter:image',
				'image',
				'image_src',
				'weibo:article:image',
				'weibo:webpage:image',
			],
		},
	],
	siteName: [
		{
			meta: ['og:site_name'],
		},
	],
	title: [
		{
			meta: [
				'twitter:title',
				'og:title',
				'citation_title',
				'dc:title',
				'dcterm:title',
				'title',
				'weibo:article:title',
				'weibo:webpage:title',
			],
		},
		'.hentry .entry-title',
		'h1#articleHeader',
		'h1.articleHeader',
		'h1.article',
		'.instapaper_title',
		'#meebo-title',
		'article h1',
		'#entry-title',
		'.entry-title',
		'#entryTitle',
		'#entrytitle',
		'.entryTitle',
		'.entrytitle',
		'#articleTitle',
		'.articleTitle',
		'post post-title',
		'h1.title',
		'h2.article',
		'h1',
		'html head title',
		'title',
	],
};
