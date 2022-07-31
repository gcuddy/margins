// much code pulled from readability, mercury-parser, but modified to be faster/type-safe

import { HTMLElement, Node, parse } from 'node-html-parser';
import {
	CLEAN_CONDITIONALLY_TAGS,
	DIV_TO_P_BLOCK_TAGS,
	IS_IMAGE,
	IS_LINK,
	IS_SRCSET,
	KEEP_SELECTORS,
	STRIP_OUTPUT_TAGS
} from './constants';
import { scoreNodes } from './scoring';
import {
	absolutizeUrls,
	changeElementTag,
	scoreCommas,
	normalizeSpaces,
	absolutizeSet,
	printRawHTMLTag
} from './utils';

import * as CustomExtractors from './extractors';
import { cleanAttributes, stripUnlikelyCandidates } from './dom';

function grabArticle(root: HTMLElement) {
	// using arc90/readability heuristics
	root = stripUnlikelyCandidates(root);
	const nodesToScore = root.querySelectorAll('p, pre, td');
	const divsToParagraphs = root
		.querySelectorAll('div')
		.filter((e) => e.querySelectorAll(DIV_TO_P_BLOCK_TAGS).length === 0);
	divsToParagraphs.forEach((e) => e.replaceWith(changeElementTag(e, 'p')));
	nodesToScore.push(...divsToParagraphs);
	return scoreNodes(nodesToScore);
}

async function grabCss(root: HTMLElement, baseUrl: string) {
	// TODO: inline element styles
	// grab all element styles
	const css = root.querySelectorAll('style');
	// fetch remote stylesheets
	const cssUrls = [...root.querySelectorAll('link[rel="stylesheet"]')].map((e) =>
		e.getAttribute('href')
	);
	const cssTexts = await Promise.all(
		cssUrls
			.filter((e) => e)
			.map((e) => new URL(<string>e, baseUrl).href)
			.map((url) => fetch(url).then((r) => r.text()))
	);
	return [...css]
		.map((e) => e.outerHTML)
		.concat(cssTexts)
		.join('\n');
}

/** start new class part */

// export const DIV_TO_P_BLOCK_TAGS = [
// 	'a',
// 	'blockquote',
// 	'dl',
// 	'div',
// 	'img',
// 	'p',
// 	'pre',
// 	'table'
// ].join(',');

// TODO: ability to add/modify this list
// TODO: add "boost" to certain tags via a map
export const POSITIVE_SCORE_HINTS = [
	'article',
	'articlecontent',
	'instapaper_body',
	'blog',
	'body',
	'content',
	'entry-content-asset',
	'entry',
	'hentry',
	'main',
	'Normal',
	'page',
	'pagination',
	'permalink',
	'post',
	'story',
	'text',
	'[-_]copy', // usatoday
	'\\Bcopy'
];
// The above list, joined into a matching regular expression
export const POSITIVE_SCORE_RE = new RegExp(POSITIVE_SCORE_HINTS.join('|'), 'i');

// TODO: same as for positive
export const NEGATIVE_SCORE_HINTS = [
	'adbox',
	'advert',
	'author',
	'bio',
	'bookmark',
	'bottom',
	'byline',
	'clear',
	'com-',
	'combx',
	'comment',
	'comment\\B',
	'contact',
	'copy',
	'credit',
	'crumb',
	'date',
	'deck',
	'excerpt',
	'featured', // tnr.com has a featured_content which throws us off
	'foot',
	'footer',
	//   "footnote", <- not sure about this one
	'graf',
	'head',
	'info',
	'infotext', // newscientist.com copyright
	'instapaper_ignore',
	'jump',
	'linebreak',
	'link',
	'masthead',
	'media',
	'meta',
	'modal',
	'outbrain', // slate.com junk
	'promo',
	'pr_', // autoblog - press release
	'related',
	'respond',
	'roundcontent', // lifehacker restricted content warning
	'scroll',
	'secondary',
	'share',
	'shopping',
	'shoutbox',
	'side',
	'sidebar',
	'sponsor',
	'stamp',
	'sub',
	'summary',
	'tags',
	'tools',
	'widget'
];
// The above list, joined into a matching regular expression
export const NEGATIVE_SCORE_RE = new RegExp(NEGATIVE_SCORE_HINTS.join('|'), 'i');

export const PHOTO_HINTS = ['figure', 'photo', 'image', 'caption'];
export const PHOTO_HINTS_RE = new RegExp(PHOTO_HINTS.join('|'), 'i');

export const NON_TOP_CANDIDATE_TAGS = [
	'br',
	'b',
	'i',
	'label',
	'hr',
	'area',
	'base',
	'basefont',
	'input',
	'img',
	'link',
	'meta'
];

export const NON_TOP_CANDIDATE_TAGS_RE = new RegExp(`^(${NON_TOP_CANDIDATE_TAGS.join('|')})$`, 'i');

const SENTENCE_END_RE = new RegExp('.( |$)');
export const hasSentencend = (text: string) => SENTENCE_END_RE.test(text);

export const FOOTNOTE_HINT_RE = /\bfootnotes?\b/i;

interface Metadata {
	title?: string;
	description?: string;
	image?: string;
	url?: string;
	author?: string;
	date?: string;
	siteName?: string;
}

// selectors can take just a string, or a string and a string which indicates the attribute (e.g. ['time', 'datetime']), or a string and a function which takes a matching node and returns a string. please be careful with the latter.
type Selector = string | [string, string] | [string, (node: Node) => string];

// is this the right way to do this lol
type MetaOptional = {
	selectors: Selector[];
	meta?: string[];
};
type SelectorsOptional = {
	selectors?: Selector[];
	meta: string[];
};
type Meta = MetaOptional | SelectorsOptional;
type MetaEntry = Meta & {
	// if true, will check selectors before meta
	checkSelectorsFirst?: boolean;

	// fallback - will use if the first batch fail, helpful if you want to check some meta, then some selectors, and then back to meta
	fallback?: Meta;

	// TODO: add Json-Ld selctor
};

// TODO: implement clean, transforms
interface IExtractor {
	title: MetaEntry;
	author: MetaEntry;
	date_published: MetaEntry;
	lead_image_url: MetaEntry;
	dek: MetaEntry;
	excerpt: MetaEntry;
	siteName: MetaEntry;
	// content is usually chosen with the algo - you can pass in selectors to use those instead
	// they work differently, though
	// for now, just an array of selectors to get the root element where the content is
	content?: string[];
	disableJSONLD: boolean;

	//todo: json-ld support in MetaEntry
}

export type CustomExtractor = Partial<IExtractor> & {
	domain: string;
};

// TODO: let this be replaced by custom extractors, ala mercury-parser
// same format as mercury - parser too
const Extractor: IExtractor = {
	title: {
		meta: [
			'twitter:title',
			'og:title',
			'dc:title',
			'dcterm:title',
			'title',
			'weibo:article:title',
			'weibo:webpage:title'
		],
		selectors: [
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
			'title'
		]
	},
	author: {
		meta: [
			'author',
			'og:author'
			// TODO: below are meta tags I want to check, but not till I check the selectors. As a sort of fallback. Maybe I should add one more key...
			// 'dc:creator',
			// 'dcterm:creator',
			// 'twitter:creator',
			// 'weibo:article:user_id',
			// 'weibo:webpage:user_id'
		],
		selectors: ['.authors-byline'],
		fallback: {
			meta: [
				'dc:creator',
				'dcterm:creator',
				'twitter:creator',
				'weibo:article:user_id',
				'weibo:webpage:user_id'
			]
		}
	},
	date_published: {
		meta: ['article:published_time', 'date', 'dc:date', 'dcterm:date'],
		selectors: [['time[itemprop="datePublished"]', 'datetime']]
	},
	lead_image_url: {
		meta: [
			// in order of priority
			'og:image',
			'twitter:image',
			'image',
			'image_src',
			'weibo:article:image',
			'weibo:webpage:image'
		],
		selectors: []
	},
	dek: {
		meta: [
			'twitter:description',
			'dc:description',
			'dcterm:description',
			'og:description',
			'description',
			'weibo:article:description',
			'weibo:webpage:description'
		],
		selectors: []
	},
	excerpt: {
		meta: [
			'twitter:description',
			'dc:description',
			'dcterm:description',
			'og:description',
			'description',
			'weibo:article:description',
			'weibo:webpage:description'
		]
	},
	siteName: {
		meta: ['og:site_name']
	},
	disableJSONLD: false
};
// TODO: add extend

const ExtractorToMetadata = {
	title: 'title',
	date_published: 'date',
	lead_image_url: 'image',
	dek: 'description',
	excerpt: 'description'
} as const;

type Entries<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T][];

export class Parser {
	baseUrl: string;
	html: string;
	root!: HTMLElement;
	metadata: Metadata = {
		title: '',
		author: '',
		description: '',
		image: '',
		url: '',
		date: '',
		siteName: ''
	};
	extractor: IExtractor;
	nodeScoreMap: Map<HTMLElement, number> = new Map();

	constructor(baseUrl: string, html?: string, customExtractor?: CustomExtractor) {
		this.baseUrl = baseUrl;
		if (html) {
			this.html = html;
		} else {
			this.html = '';
		}
		if (customExtractor) {
			this.extractor = { ...Extractor, ...customExtractor };
		} else {
			this.extractor = Extractor;
			// look to match domain
			const url = new URL(baseUrl);
			const domain = url.hostname;
			for (const [key, value] of Object.entries(CustomExtractors)) {
				if (value.domain === domain) {
					console.log(`Sweet, found a custom extractor for ${domain}!`);
					this.extractor = { ...Extractor, ...value };
					break;
				}
			}
			console.log(`here's the extractor we're going with:`, this.extractor);
		}
	}

	async parse() {
		console.time('parse');
		if (!this.html) {
			await this.fetchHtml(this.baseUrl).then((html) => (this.html = html));
		}
		this.getRoot();
		if (!this.root) {
			throw new Error('No root to parse');
		}
		// todo: fix lazy loaded images
		// <img data-component="lazy-embed" data-src="https://media.timeout.com/images/105877787/image.jpg" width="100%">
		this.getMetadata();
		const content = this.getContent();
		// if there's no title, set it to url
		if (!this.metadata.title) {
			this.metadata.title = this.metadata.url || this.baseUrl;
		}
		console.log(`Meta: ${JSON.stringify(this.metadata)}`);
		if (!this.metadata.description) {
			this.metadata.description = content.innerText.slice(0, 200);
		}
		console.timeEnd('parse');
		return {
			content: content.innerHTML,
			...this.metadata,
			wordCount: content.innerText.split(' ').length,
			textContent: content.innerText
		};
	}

	private getRoot() {
		if (!this.html) {
			throw new Error('No html to parse');
		}
		this.root = parse(this.html);
	}

	private getMetadata() {
		if (!this.extractor.disableJSONLD) {
			this.scrapeJsonLd();
		}
		const metaEls = this.root.querySelectorAll('meta');
		const metadataToExtractorHash = {
			title: ['title'],
			description: ['dek', 'excerpt'],
			image: ['lead_image_url'],
			date: ['date_published'],
			author: ['author'],
			siteName: ['siteName']
		} as const;
		console.log({ metadata: this.metadata });
		type MetadataToExtractorKeys = keyof typeof metadataToExtractorHash;
		for (const metaKey of Object.keys(metadataToExtractorHash) as MetadataToExtractorKeys[]) {
			// if we already have the metadata, continue
			if (this.metadata[metaKey]) continue;
			while (!this.metadata[metaKey]) {
				console.log(`looking for ${metaKey}`);
				metadataToExtractorHash[metaKey].forEach((key) => {
					const extractor = this.extractor[key];
					if (!extractor) return;
					if (!extractor.checkSelectorsFirst) {
						// check meta
						console.log(
							`checking meta ${key} - ${this.scrapeMetaTags(metaEls, extractor.meta || [])}`
						);
						this.metadata[metaKey] = this.scrapeMetaTags(metaEls, extractor.meta || []);
						console.log({
							metaKey: this.metadata[metaKey]
						});
						if (this.metadata[metaKey]) return;
						this.metadata[metaKey] = this.extractFromSelectors(
							this.root,
							extractor.selectors || []
						);
					} else {
						// check selectors - how to make this more DRY?
						this.metadata[metaKey] = this.extractFromSelectors(
							this.root,
							extractor.selectors || []
						);
						if (this.metadata[metaKey]) return;
						this.metadata[metaKey] = this.scrapeMetaTags(metaEls, extractor.meta || []);
					}
				});
				// TODO: after trying with custom extractor, fall back to default extractor
				// if we got here, then we didn't find the metadata - break
				if (!this.metadata[metaKey]) break;
			}
		}
		// todo: place here: try fallbacks
		this.cleanMetadata();
		// TODO: fix not properly getting description 2022-03-30 16:47 where i left off
		// if no image, put in request to screenshot site, or else create svg from text of article - is that possible?
		// todo: add selecting image from content via mercury-parser
		// TODO: add get url and get content if selector present
	}

	private cleanMetadata() {
		// just some simple house cleaning:
		// let's start with the author
		if (this.metadata.author) {
			// first let's trim whitespace
			this.metadata.author = this.metadata.author.trim();

			// if the author starts with "by " then the author, remove the "by "
			if (this.metadata.author && this.metadata.author.toLowerCase().startsWith('by ')) {
				this.metadata.author = this.metadata.author.slice(3);
			}
		}
	}

	private scrapeMetaTags(metaEls: HTMLElement[], names: string[]) {
		// only scrape where metadata is not already set
		for (const name of names) {
			const meta = metaEls.find(
				(el) => el.getAttribute('name') === name || el.getAttribute('property') === name
			);
			console.log(`Found meta tag ${name}`);
			if (meta) return meta.getAttribute('content');
		}
	}

	private getContent() {
		console.log('*** Starting to Get Content ***');
		let topNode: HTMLElement | undefined;
		if (this.extractor.content) {
			topNode = this.extractContentFromSelectors(this.root, this.extractor.content || []);
			// get content this way
			// return content
		}
		if (!topNode) {
			const nodesToScore = this.getNodesToScore();
			this.scoreNodes(nodesToScore);
			topNode = this.getTopCandidate();
		}
		if (!topNode) {
			// if STILL no top node, then we've got a problem
			throw new Error('No top candidate');
		}
		// now clean up node
		return this.cleanContent(topNode);
	}

	private scoreNodes(nodes: HTMLElement[]) {
		console.log('*** Starting to Score Nodes ***');
		console.log(
			`We have ${nodes.length} nodes to score! Here's a look at them:`,
			JSON.stringify(
				nodes.map((node) => node.rawText),
				null,
				2
			)
		);
		for (const node of nodes) {
			const parent = node.parentNode;
			// console.log({ parent });
			const grandparent = parent?.parentNode;
			const text = node.innerText;
			//   skip if no parent or text is less than 25
			if (!parent) continue;
			if (text.length < 25) continue;
			//   initialize parent & grandparent nodes if they're not in our map
			if (!this.nodeScoreMap.has(parent)) {
				this.initializeNode(parent);
			}
			if (grandparent && !this.nodeScoreMap.has(grandparent)) {
				this.initializeNode(grandparent);
			}
			// TODO: 20220322191700 this is where i left off
			// now score the paragraph itself (which we're in)
			// should this be a separate function?
			let score = 1; // starting at 1 as a base

			// add points for commas (idk, everyone seems to do this, seems arbitrary)
			score += text.split(',').length;

			// add another point (up to 3 points) for every 50 chars in the paragraph (readability does 100 chars, but i like mercury-parser doing 50)
			score += Math.min(Math.floor(text.length / 50), 3);

			// arbitrarily adding 2/3 to parent and 1/3 to grandparent
			// readability adds full to parent and 1/2 to grandparent
			// mercury-parser add .25 to parent and 0 to grandparent...
			this.updateScore(parent, score * (2 / 3));
			if (grandparent) this.updateScore(grandparent, score * (1 / 3));
		}
	}
	private getLinkDensity(container: HTMLElement) {
		const links = container.querySelectorAll('a');
		const textLength = container.innerText.length;
		const linkLength = links.reduce((acc: number, el: HTMLElement) => acc + el.innerText.length, 0);
		if (!textLength && linkLength) return 1;
		if (textLength) return linkLength / textLength;
		return 0;
	}

	private compareScores(a: HTMLElement | number, b: HTMLElement | number) {
		if (!a && a !== 0) return false;
		if (!b && b !== 0) return true;
		const a_score = typeof a === 'number' ? a : this.nodeScoreMap.get(a);
		const b_score = typeof b === 'number' ? b : this.nodeScoreMap.get(b);
		if (a_score && b_score) {
			return a_score >= b_score;
		} else if (a_score && !b_score) {
			return true;
		}
		return false;
	}

	private getTopCandidate() {
		// update scores with link density - can we do that before?
		console.log('*** 🥁 Starting to Get Top Candidate 🥁 ***');
		console.log(`First, a look at our scorecard: ${JSON.stringify(this.nodeScoreMap)}`);
		let topCandidate: HTMLElement | undefined = undefined;
		for (const [el] of this.nodeScoreMap) {
			this.updateScore(el, (score) => score * (1 - this.getLinkDensity(el)));
			if (!topCandidate || this.compareScores(el, topCandidate)) {
				topCandidate = el;
			}
		}
		if (!topCandidate) {
			const body = this.root.querySelector('body');
			if (body) {
				topCandidate = body;
			} else {
				// set to whole html, but this is only if there's no body tag - unlikely
				topCandidate = this.root.querySelector('html') as HTMLElement;
			}
		}
		// console.log({ topCandidate });
		// console.log(JSON.stringify(this.nodeScoreMap.entries(), null, 2));
		// now merge all its siblings to create our article, before processing
		// console.log({ topCandidateSibling: topCandidate?.previousElementSibling });
		topCandidate = this.mergeSiblings(topCandidate as HTMLElement);

		// look in arc90 preparticle and mercury-parser cleaners/content
		// TODO: next page link?

		// we should also run a check to see if the top candidate is usable

		// we also need to get the proper metadata
		return topCandidate;
	}

	private mergeSiblings(topCandidate: HTMLElement) {
		console.log('*** Starting to Merge Siblings ***');
		console.log(
			`Ok, so here's what our topCandidate looks like so far:`,
			printRawHTMLTag(topCandidate)
		);
		const topCandidateScore = this.nodeScoreMap.get(topCandidate);
		if (!topCandidateScore) {
			throw Error('Error getting top candidate score');
		}
		// mercury-parser uses .25, arc90 uses .2,
		const siblingScoreThreshold = Math.max(10, topCandidateScore * 0.25);
		const wrapper = parse('<div></div>');
		const siblingNodes = topCandidate.parentNode.childNodes;
		// console.log({ siblingNodes });
		// loop thru all siblings
		// add ones that score high enough to a wrapper div that will hold our content
		let index = 0;
		for (const siblingNode of siblingNodes) {
			console.log(`first siblingNode: ${siblingNode.rawText}`);
			index++; // <- this is a ONE-BASED index, not zero-based (matches with length)
			// taken from mercury parser
			let siblingCandidate: HTMLElement | undefined = undefined;
			if (siblingNode.nodeType === 1) {
				siblingCandidate = siblingNode as HTMLElement;
			}
			if (!siblingCandidate) continue;
			if (NON_TOP_CANDIDATE_TAGS_RE.test(siblingCandidate.tagName)) continue;
			const siblingScore = this.nodeScoreMap.get(siblingCandidate);
			if (!siblingScore) continue;
			//   if it's actually the top candidate, then append to our wrapper
			// console.log('mergesiblings', { siblingCandidate, topCandidate });
			if (siblingCandidate === topCandidate) {
				wrapper.appendChild(siblingCandidate);
				continue;
			}
			// score the siblingCandidate now
			let contentBonus = 0;

			// give a bonus if sibling nodes and top candidates have the example same classname
			if (siblingCandidate.classList.toString() === topCandidate.classList.toString()) {
				contentBonus += topCandidateScore * 0.2;
			}
			// now let's test link density
			const linkDensity = this.getLinkDensity(siblingCandidate);
			// give it a small bonus if it has a low link density, give it a penalty if it's highger
			if (linkDensity < 0.05) {
				contentBonus += 20;
			} else if (linkDensity >= 0.5) {
				contentBonus -= 20;
			}
			const newScore = siblingScore + contentBonus;
			// console.log(
			// 	`Looking at sibling ${siblingCandidate.tagName}.${siblingCandidate.classNames} with score ${siblingScore}`
			// );
			if (newScore >= siblingScoreThreshold) {
				wrapper.appendChild(siblingCandidate);
				// console.log(`Added`);
				continue;
			}
			// let's do further inspecting if it's a P
			if (siblingCandidate.tagName === 'P') {
				const siblingContent = siblingCandidate.innerText;
				const siblingContentLength = siblingContent.length;
				if (siblingContentLength > 80 && linkDensity < 0.25) {
					wrapper.appendChild(siblingCandidate);
					// console.log(`Added`);
					continue;
				}
				if (siblingContentLength <= 80 && linkDensity === 0 && hasSentencend(siblingContent)) {
					wrapper.appendChild(siblingCandidate);
					// console.log(`Added`);
					continue;
				}
			}
			// make sure div.footnotes gets added
			if (siblingNodes.length - index <= 2) {
				// it's in the last couple of nodes
				if (
					FOOTNOTE_HINT_RE.test(siblingCandidate.classList.toString()) ||
					FOOTNOTE_HINT_RE.test(siblingCandidate.id)
				) {
					wrapper.appendChild(siblingCandidate);
					// console.log(`Added`);
					continue;
				}
			}
		}
		// todo: arc90 turns nodes into divs if they're not divs or ps
		// https://github.com/masukomi/arc90-readability/blob/aca36d14c6a4096d0dcaea94539d4576a485abff/js/readability.js#L930
		return wrapper;
	}

	private initializeNode(node: HTMLElement) {
		// console.log('-- initializing node --');
		this.nodeScoreMap.set(node, 0);
		// Modifiying this slightly from arc90 to get with the times (stolen from Mercury-Parser's constants)
		switch (node.tagName) {
			case 'DIV': {
				this.updateScore(node, 5);
				break;
			}
			case 'PRE':
			case 'TD':
			case 'OL':
			case 'UL':
			case 'DL':
			case 'BLOCKQUOTE': {
				this.updateScore(node, 3);
				break;
			}
			case 'ADDRESS':
			case 'FORM':
				this.updateScore(node, -3);
				break;
			case 'TH':
				this.updateScore(node, -5);
				break;
		}
		this.updateScore(node, this.getWeight(node));
		// console.log({ nodeScoreMap: this.nodeScoreMap.get(node) });
	}

	private getWeight(el: HTMLElement) {
		// TODO: setting to turn this off
		let weight = 0;
		// to think about: is it better to use simple regex, or match within domtokenlist?
		const classNames = el.classList.toString();
		if (el.id) {
			// testing out ids being worth a bit more...
			if (NEGATIVE_SCORE_RE.test(el.id)) weight -= 30;
			if (POSITIVE_SCORE_RE.test(el.id)) weight += 30;
		}
		if (classNames) {
			// test classname and add/subtract points depending on match
			if (NEGATIVE_SCORE_RE.test(classNames)) weight -= 25;
			if (POSITIVE_SCORE_RE.test(classNames)) weight += 25;
			// try to keep photos
			if (PHOTO_HINTS_RE.test(classNames)) weight += 15;
		}
		// console.log({ weight });
		return weight;
	}

	private updateScore(node: HTMLElement, score: number | ((n: number) => number)) {
		// console.log('-- Updating score --');
		const currentScore = this.nodeScoreMap.get(node);
		// console.log({ currentScore });
		if (typeof currentScore !== 'number') return;
		if (typeof score === 'number') {
			this.nodeScoreMap.set(node, currentScore + score);
		} else {
			this.nodeScoreMap.set(node, score(currentScore));
		}
		// console.log(`Updated score for ${node.tagName} to ${this.nodeScoreMap.get(node)}`);
	}

	private getNodesToScore() {
		const nodesToScore = this.root.querySelectorAll('p, pre, td');
		const divsToParagraphs = this.root
			.querySelectorAll('div')
			.filter((e) => e.querySelectorAll(DIV_TO_P_BLOCK_TAGS).length === 0);
		divsToParagraphs.forEach((e) => e.replaceWith(this.changeElementTag(e, 'p')));
		nodesToScore.push(...divsToParagraphs);
		return nodesToScore;
	}

	private changeElementTag(element: HTMLElement, tagName: string) {
		return parse(`<${tagName}>${element.innerHTML}</${tagName}>`);
	}

	private scrapeJsonLd() {
		const jsonLd = this.root?.querySelectorAll('script[type="application/ld+json"]');
		if (!jsonLd) {
			return;
		}
		const json = jsonLd.map((json) => JSON.parse(json.innerHTML));
		// JSON.parse(jsonLd.innerHTML);
		if (!json) {
			return;
		}
		this.metadata.title = this.getJsonLdvalue(json, 'headline', 'title', 'name');
		this.metadata.image = this.getJsonLdvalue(json, ['image', 'url']);
		this.metadata.url = this.getJsonLdvalue(json, 'url');
		this.metadata.author = this.getJsonLdvalue(json, ['author', 'name']);
		this.metadata.description = this.getJsonLdvalue(json, 'description');
		this.metadata.date = this.getJsonLdvalue(json, 'datePublished');
		this.metadata.siteName = this.getJsonLdvalue(json, 'publisher', 'name');
		console.log(
			`Hello, this is our metadata so far after scrapeJsonLd(): ${JSON.stringify(this.metadata)}`
		);
	}

	/**
	 *
	 * @param json - array of json-ld objects
	 * @param keys - keys to search for. Either pass in a string (e.g. 'description') or [string, string] (e.g. ['author', 'name']) — the first key will be used to search for the value, the second will be used to search for the value of the first key's value
	 * @returns the value of the first key that is found
	 */
	private getJsonLdvalue(jsons: any[], ...keys: (string | [string, string])[]) {
		// TODO: abstract this out to utils file
		// maybe todo: add types for JSONLD
		for (const key of keys) {
			for (const json of jsons) {
				if (typeof key === 'string') {
					console.log(`Searching for ${key} in ${JSON.stringify(json)}`);
					if (json[key] && typeof json[key] === 'string') {
						return json[key] as string;
					}
				} else if (Array.isArray(key)) {
					console.log(`Searching for ${key[0]} & ${key[1]} in ${JSON.stringify(json)}`);
					if (Array.isArray(json[key[0]])) {
						console.log(`Searching for ${key[1]} in ${JSON.stringify(json[key[0]])}`);
						const arr = json[key[0]];
						const secondaryKey = key[1];
						if (arr[0] && typeof arr[0][secondaryKey] === 'string') {
							console.log(`Found ${key[1]} in ${JSON.stringify(arr[0])}: ${arr[0][secondaryKey]}`);
							return arr[0][secondaryKey] as string;
							return json[0][key[1]] as string;
						}
					} else if (typeof json[key[0]] === 'string') {
						return json[key[0]] as string;
					} else if (json[key[0]] && typeof json[key[0]][key[1]] === 'string') {
						return json[key[0]][key[1]] as string;
					}
				}
			}
		}
		return undefined;
	}

	private cleanContent(node: HTMLElement) {
		// convert top level html or body tag to div
		if (node.tagName === 'HTML' || node.tagName === 'BODY') {
			node.replaceWith(this.changeElementTag(node, 'div'));
		}
		['href', 'src'].forEach((a) => absolutizeUrls(node, this.baseUrl, a));
		absolutizeSet(node, this.baseUrl);
		// did that work?
		// console.log(node.querySelectorAll('a[href]'));
		STRIP_OUTPUT_TAGS.forEach((tag) => {
			const elements = node.querySelectorAll(tag);
			console.log('elements to strip', elements);
			elements.forEach((e) => {
				const matches = e.parentNode.querySelectorAll(KEEP_SELECTORS.join(', '));
				if (!matches.some((match) => match === e)) {
					console.log('stripping', e);
					e.remove();
				}
			});
		});
		const hOnes = node.querySelectorAll('h1');
		if (hOnes.length < 3) {
			hOnes.forEach((e) => e.remove());
		} else {
			hOnes.forEach((e) => {
				e.replaceWith(this.changeElementTag(e, 'h2'));
			});
		}
		const otherHeaders = node.querySelectorAll('h2, h3, h4, h5, h6');
		otherHeaders.forEach((header) => {
			if (normalizeSpaces(header.innerText) === this.metadata.title) {
				header.remove();
			}
			if (this.getWeight(header) < 0) {
				// header.remove();
			}
		});
		const tagsToClean = node.querySelectorAll(CLEAN_CONDITIONALLY_TAGS);
		tagsToClean.forEach((tag) => {
			// if it's a form, drop it
			if (tag.tagName === 'FORM') {
				tag.remove();
				return;
			}
			//todo: keep class
			const weight = this.getWeight(tag);
			if (weight < 0) {
				tag.remove();
			} else {
				const tagContent = normalizeSpaces(tag.innerText);
				if (scoreCommas(tagContent) < 10) {
					const pCount = tag.querySelectorAll('p').length;
					const inputCount = tag.querySelectorAll('input').length;
					if (inputCount > pCount / 3) {
						tag.remove();
						return;
					}
					const imgCount = tag.querySelectorAll('img').length;
					if (tagContent.length < 25 && imgCount === 0) {
						tag.remove();
						return;
					}
					const density = this.getLinkDensity(tag);
					if (weight < 25 && density > 0.2 && tagContent.length > 75) {
						tag.remove();
						return;
					}
					if (weight >= 25 && density > 0.5) {
						// this one i'm unsure of
					}
					const scriptCount = tag.querySelectorAll('script').length;
					if (scriptCount > 0 && tagContent.length < 150) {
						tag.remove();
						return;
					}
				}
			}
		});

		// clean up lazy loaded images
		node = this.convertLazyLoadedImages(node);

		// todo: remove empty paragraphs, and remove unneccessary attributes

		/** Remove Attributes */
		node = cleanAttributes(node);

		// also check arc90 for what they do
		return node;
	}

	private extractFromSelectors(root: HTMLElement, selectors: Selector[], maxChildren = 1) {
		console.log({ selectors });
		for (const selector of selectors) {
			// This seems wrong… how can I be doing this for each metadata piece?
			console.log(`trying this selector:`, selector);
			const elements = root.querySelectorAll(typeof selector === 'string' ? selector : selector[0]);
			// if (elements.length !== 1) continue;
			// currently, it just gets the first match ?
			const element = elements[0];
			if (!element) continue;
			if (element && element.childNodes.length > maxChildren) continue;
			console.log(`we've got a match! for ${selector}:`, element);
			if (element && typeof selector === 'string') {
				const text = element.innerText;
				console.log(`and here's the text:`, text);
				if (text) return text;
			} else if (element && typeof selector[1] === 'function') {
				const text = selector[1](element);
				console.log(`and here's the text:`, text);
				if (text) return text;
			} else if (element && typeof selector[1] === 'string') {
				const text = element.getAttribute(selector[1]);
				console.log(`and here's the text:`, text);
				if (text) return text;
			}
		}
	}

	private extractContentFromSelectors(root: HTMLElement, selectors: string[]) {
		console.log(
			`Attempting to extract **content** from selectors, because these were provided:`,
			selectors
		);
		for (const selector of selectors) {
			console.log(`trying this selector:`, selector);
			const element = root.querySelector(selector);
			if (!element) continue;
			console.log(`Woohoo! Nice! We've got a match for your selector: ${selector}.`, element);
			return element;
		}
	}

	private convertLazyLoadedImages(node: HTMLElement) {
		// credit https://github.com/postlight/mercury-parser/blob/HEAD/src/resource/utils/dom/convert-lazy-loaded-images.js
		const imgs = node.querySelectorAll('img');
		for (const img of imgs) {
			const attrs = img.attributes;
			for (const attr in attrs) {
				const value = attrs[attr];
				if (!value) continue;
				if (attr !== 'srcset' && IS_LINK.test(value) && IS_SRCSET.test(value)) {
					img.setAttribute('srcset', value);
				} else if (
					attr !== 'src' &&
					attr !== 'srcset' &&
					IS_LINK.test(value) &&
					IS_IMAGE.test(value)
				) {
					img.setAttribute('src', value);
				}
			}
		}

		// convert amp-img to img tag
		const ampImgs = node.querySelectorAll('amp-img');
		for (const ampImg of ampImgs) {
			console.log('ampImg', ampImg);
			ampImg.replaceWith(`<img src="${ampImg.getAttribute('src')}">`);
		}

		return node;
	}

	async fetchHtml(url: string) {
		return await fetch(url).then((r) => r.text());
	}
}
