/* eslint-disable @typescript-eslint/no-explicit-any */
import { XMLParser } from 'fast-xml-parser';
import type { FeedMeta, PodcastEpisode } from './types';

const parser = new XMLParser({
	attributeNamePrefix: '',
	ignoreAttributes: false,
	parseAttributeValue: true,
});

const ERRORS = {
	optionsError: new Error('Invalid options.'),
	requiredError: new Error(
		'One or more required values are missing from feed.',
	),
};

/*
============================================
=== CONSTANTS ===
============================================
*/
const NS = {
	itunesAuthor: 'itunes:author',
	itunesBlock: 'itunes:block',
	itunesCategory: 'itunes:category',
	itunesComplete: 'itunes:complete',
	itunesDuration: 'itunes:duration',
	itunesEmail: 'itunes:email',
	itunesExplicit: 'itunes:explicit',
	itunesImage: 'itunes:image',
	itunesKeywords: 'itunes:keywords',
	itunesName: 'itunes:name',
	itunesOrder: 'itunes:order',
	itunesOwner: 'itunes:owner',
	itunesSubtitle: 'itunes:subtitle',
	itunesSummary: 'itunes:summary',
	itunesType: 'itunes:type',
	podcastChapters: 'podcast:chapters',
	podcastFunding: 'podcast:funding',
	podcastLocked: 'podcast:locked',
	podcastSoundbite: 'podcast:soundbite',
	podcastTranscript: 'podcast:transcript',
	podcastValue: 'podcast:value',
	podcastValueRecipient: 'podcast:valueRecipient',
} as const;

/*
============================================
=== DEFAULT OPTIONS and OPTIONS BUILDING ===
============================================
*/

const fieldsMeta = [
	'author',
	'blocked',
	'categories',
	'complete',
	'description',
	'docs',
	'editor',
	'explicit',
	'funding',
	'generator',
	'guid',
	'imageURL',
	'keywords',
	'language',
	'lastBuildDate',
	'link',
	'locked',
	'pubDate',
	'owner',
	'subtitle',
	'summary',
	'title',
	'type',
	'value',
	'webMaster',
];

const fieldsEpisodes = [
	'author',
	'blocked',
	'chapters',
	'description',
	'duration',
	'enclosure',
	'explicit',
	'funding',
	'guid',
	'imageURL',
	'keywords',
	'language',
	'link',
	'order',
	'pubDate',
	'soundbite',
	'subtitle',
	'summary',
	'title',
	'transcript',
	'value',
];

const requiredMeta: Array<string> = [];
const requiredEpisodes: Array<string> = [];

const uncleanedMeta = ['categories', 'funding', 'guid', 'value'];
const uncleanedEpisodes = [
	'funding',
	'guid',
	'soundbite',
	'transcript',
	'value',
];

const DEFAULT = {
	fields: {
		episodes: fieldsEpisodes,
		meta: fieldsMeta,
	},
	required: {
		episodes: requiredEpisodes,
		meta: requiredMeta,
	},
	uncleaned: {
		episodes: uncleanedEpisodes,
		meta: uncleanedMeta,
	},
};

// from https://stackoverflow.com/questions/1584370/how-to-merge-two-arrays-in-javascript-and-de-duplicate-items
function mergeDedupe(arr) {
	return [...new Set([].concat(...arr))];
}

const buildOptions = (params: typeof DEFAULT) => {
	try {
		let options = {
			fields: {
				episodes: fieldsEpisodes,
				meta: fieldsMeta,
			},
			required: {
				episodes: requiredEpisodes,
				meta: requiredMeta,
			},
			uncleaned: {
				episodes: uncleanedEpisodes,
				meta: uncleanedMeta,
			},
		};

		// if no options parameters given, use default
		if (params === undefined) {
			options = DEFAULT;
			return options;
		}

		// merge empty options and given options
		Object.keys(options).forEach((key) => {
			if (params[key as keyof typeof params] !== undefined) {
				Object.assign(
					options[key as keyof typeof options],
					params[key as keyof typeof params],
				);
			}
		});

		// if 'default' given in parameters, merge default options with given custom options
		//  and dedupe
		if (options.fields.meta.indexOf('default') >= 0) {
			options.fields.meta = mergeDedupe([
				DEFAULT.fields.meta,
				params.fields.meta,
			]);
			options.fields.meta.splice(options.fields.meta.indexOf('default'), 1);
		}

		if (options.fields.episodes.indexOf('default') >= 0) {
			options.fields.episodes = mergeDedupe([
				DEFAULT.fields.episodes,
				params.fields.episodes,
			]);
			options.fields.episodes.splice(
				options.fields.episodes.indexOf('default'),
				1,
			);
		}

		return options;
	} catch {
		throw ERRORS.optionsError;
	}
};

/*
=====================
=== GET FUNCTIONS ===
=====================
*/

const GET = {
	author(node) {
		if (node.author) {
			return node.author;
		} else if (node[NS.itunesAuthor]) {
			return node[NS.itunesAuthor];
		}
	},

	blocked(node) {
		return node[NS.itunesBlock];
	},

	categories(node) {
		// returns categories as an array containing each category/sub-category
		// grouping in lists. If there is a sub-category, it is the second element
		// of an array.

		const itunesCategories = node['itunes:category'];
		if (Array.isArray(itunesCategories)) {
			const categoriesArray = itunesCategories.map((item) => {
				let category = '';
				if (item && item['$'] && item['$'].text) {
					category += item['$'].text; // primary category
					if (item[NS.itunesCategory]) {
						// sub-category
						category += `>${item[NS.itunesCategory][0]['$'].text}`;
					}
				}
				return category;
			});
			return categoriesArray;
		}

		return [];
	},

	chapters(node) {
		const items = getItemsWithAttrs(node[NS.podcastChapters]);
		if (items && items[0]) {
			return {
				type: items[0].attrs.type,
				url: items[0].attrs.url,
			};
		}
	},

	complete(node) {
		return node[NS.itunesComplete];
	},

	duration(node) {
		return node[NS.itunesDuration];
	},

	editor(node) {
		return node.managingEditor;
	},

	explicit(node) {
		return node[NS.itunesExplicit];
	},

	funding(node) {
		const items = getItemsWithAttrs(node[NS.podcastFunding]);
		const finalItems = [];

		for (const item of items) {
			finalItems.push({
				url: item.attrs.url,
				value: item.value,
			});
		}

		return finalItems;
	},

	guid(node) {
		if (node.guid) {
			if (typeof node.guid === 'string') {
				return node.guid;
			} else if (Array.isArray(node.guid) && node.guid[0] && node.guid[0]._) {
				return node.guid[0]._;
			}
		}
	},

	imageURL(node) {
		if (
			node['itunes:image'] &&
			node['itunes:image'][0] &&
			node['itunes:image'][0]['$'] &&
			node['itunes:image'][0]['$'].href
		) {
			return node['itunes:image'][0]['$'].href;
		}

		if (typeof node['itunes:image'] === 'string') {
			return node['itunes:image'];
		}

		if (node.image && node.image[0] && node.image[0].url[0]) {
			return node.image[0].url[0];
		}

		return undefined;
	},

	/*
    NOTE: This is part of the Podcast Index namespace spec.
    This is a Phase 2 namespace and has not been formalized at this time.
    https://github.com/Podcastindex-org/podcast-namespace/tree/7c9516937e74b8058d7d49e2b389c7c361cc6a48

    ---

    images: function (node) {
      const item = getItemsWithAttrs(node['podcast:images'])
      if (item[0]) {
        const srcset = item.attrs.srcset
        const srcSetArray = convertCommaDelimitedStringToArray(srcset)
        const parsedSrcSet = []
        for (let str of srcSetArray) {
          str = str.trim()
          const srcSetAttrs = str.split(' ')
          if (srcSetAttrs.length === 2) {
            parsedSrcSet.push({
              url: srcSetAttrs[0],
              width: srcSetAttrs[1]
            })
          }
        }

        return {
          srcset: parsedSrcSet
        }
      }
    },
  */

	keywords(node) {
		return node[NS.itunesKeywords];
	},

	/*
    NOTE: This is part of the Podcast Index namespace spec.
    This is a Phase 2 namespace and has not been formalized at this time.
    https://github.com/Podcastindex-org/podcast-namespace/tree/7c9516937e74b8058d7d49e2b389c7c361cc6a48

    ---

    location: function (node) {
      const item = getItemsWithAttrs(node['podcast:location'])
      if (item) {
        return {
          value: item.value,
          latlon: item.attrs.latlon,
          osmid: item.attrs.osmid
        }
      }
    },
  */

	locked(node) {
		const items = getItemsWithAttrs(node[NS.podcastLocked]);
		if (items[0]) {
			return {
				owner: items[0].attrs.owner,
				value: items[0].value,
			};
		}
	},

	order(node) {
		return node[NS.itunesOrder];
	},

	owner(node) {
		return node[NS.itunesOwner];
	},

	soundbite(node) {
		const items = getItemsWithAttrs(node[NS.podcastSoundbite]);
		const finalItems = [];

		for (const item of items) {
			const duration = Number.parseFloat(item.attrs.duration);
			const startTime = Number.parseFloat(item.attrs.startTime);

			if (!duration) {
				continue;
			}
			if (!startTime && startTime !== 0) {
				continue;
			}

			finalItems.push({
				duration,
				startTime,
				title: item.value,
			});
		}

		return finalItems;
	},

	subtitle(node) {
		return node[NS.itunesSubtitle];
	},

	summary(node) {
		return node[NS.itunesSummary];
	},

	transcript(node) {
		const items = getItemsWithAttrs(node[NS.podcastTranscript]);
		const finalItems = [];

		if (Array.isArray(items)) {
			for (const item of items) {
				const { language, rel, type, url } = item.attrs;
				finalItems.push({
					language,
					rel,
					type,
					url,
				});
			}
		}

		return finalItems;
	},

	type(node) {
		return node[NS.itunesType];
	},

	/*
    NOTE: This is part of the Podcast Index namespace spec.
    https://github.com/Podcastindex-org/podcast-namespace/tree/7c9516937e74b8058d7d49e2b389c7c361cc6a48
  */
	value(node) {
		const valueItems = getItemsWithAttrs(node[NS.podcastValue], [
			NS.podcastValueRecipient,
		]);
		let finalValues = null;

		if (valueItems && valueItems.length > 0) {
			finalValues = [];
			for (const valueItem of valueItems) {
				const { method, suggested, type } = valueItem.attrs;
				const finalValue = { method, suggested, type };

				const valueRecipientItems =
					valueItem.nestedTags &&
					valueItem.nestedTags[NS.podcastValueRecipient];
				if (Array.isArray(valueRecipientItems)) {
					const finalRecipients = [];
					for (const valueRecipientItem of valueRecipientItems) {
						const { address, customKey, customValue, fee, name, split, type } =
							valueRecipientItem.attrs;
						finalRecipients.push({
							address,
							customKey,
							customValue,
							fee,
							name,
							split,
							type,
						});
					}
					finalValue.recipients = finalRecipients;
					finalValues.push(finalValue);
				}
			}
		}

		return finalValues;
	},
} satisfies Record<string, (node: any) => unknown>;

const getDefault = function (node: any, field: string) {
	return node[field] ? node[field] : undefined;
};

/*
=======================
=== CLEAN FUNCTIONS ===
=======================
*/

const CLEAN = {
	author(obj) {
		return obj;
	},

	blocked(string) {
		return string.toLowerCase == 'yes' ? true : false;
	},

	complete(string) {
		return string[0].toLowerCase == 'yes' ? true : false;
	},

	duration(arr) {
		// gives duration in seconds
		let times = arr[0].split(':'),
			sum = 0,
			mul = 1;

		while (times.length > 0) {
			sum += mul * Number.parseInt(times.pop());
			mul *= 60;
		}

		return sum;
	},

	enclosure(object) {
		return {
			length: object[0]['$'].length,
			type: object[0]['$'].type,
			url: object[0]['$'].url,
		};
	},

	explicit(string) {
		if (['yes', 'explicit', 'true'].indexOf(string[0].toLowerCase()) >= 0) {
			return true;
		} else if (['clean', 'no', 'false'].indexOf(string[0].toLowerCase()) >= 0) {
			return false;
		} else {
			return undefined;
		}
	},

	imageURL(string) {
		return string;
	},

	owner(object) {
		const ownerObject = {};

		if (object[0]?.hasOwnProperty(NS.itunesName)) {
			ownerObject.name = object[0][NS.itunesName][0];
		}

		if (object[0]?.hasOwnProperty(NS.itunesEmail)) {
			ownerObject.email = object[0][NS.itunesEmail][0];
		}

		return ownerObject;
	},
} satisfies Record<string, (node: any) => unknown>;

const cleanDefault = function (node: any) {
	// return first item of array
	return node !== undefined && Array.isArray(node) && node[0] !== undefined
		? node[0]
		: node;
};

/*
=================================
=== OBJECT CREATION FUNCTIONS ===
=================================
*/

const getInfo = (node: any, field: string, uncleaned?: boolean) => {
	// gets relevant info from podcast feed using options:
	// @field - string - the desired field name, corresponding with GET and clean
	//     functions
	// @uncleaned - boolean - if field should not be cleaned before returning

	if (!node) {
		return undefined;
	}

	let info;

	// if field has a GET function, use that
	// if not, get default value
	info =
		field in GET && GET[field as keyof typeof GET]
			? GET[field as keyof typeof GET](node)
			: getDefault(node, field);

	// if field is not marked as uncleaned, clean it using CLEAN functions
	if (!uncleaned && info !== undefined) {
		info =
			field in CLEAN && CLEAN[field as keyof typeof CLEAN]
				? CLEAN[field as keyof typeof CLEAN](info)
				: cleanDefault(info);
	}

	return info;
};

function createMetaObjectFromFeed(channel: any, options: typeof DEFAULT) {
	const meta = {};

	if (Array.isArray(options.fields.meta)) {
		options.fields.meta.forEach((field) => {
			const obj: Record<string, any> = {};
			let uncleaned = false;

			if (options.uncleaned && Array.isArray(options.uncleaned.meta)) {
				uncleaned = options.uncleaned.meta.indexOf(field) >= 0;
			}

			obj[field] = getInfo(channel, field, uncleaned);

			Object.assign(meta, obj);
		});
	}

	if (options.required && Array.isArray(options.required.meta)) {
		options.required.meta.forEach((field) => {
			if (Object.keys(meta).indexOf(field) < 0) {
				throw ERRORS.requiredError;
			}
		});
	}

	return meta;
}

// function builds episode objects from parsed podcast feed
function createEpisodesObjectFromFeed(channel: any, options: typeof DEFAULT) {
	const episodes: Array<PodcastEpisode> = [];

	if (channel && Array.isArray(channel.item)) {
		channel.item.forEach((item: any) => {
			const episode = {} as PodcastEpisode;

			if (options.fields && Array.isArray(options.fields.episodes)) {
				options.fields.episodes.forEach((field) => {
					const obj: Record<string, any> = {};
					let uncleaned = false;
					if (options.uncleaned && Array.isArray(options.uncleaned.episodes)) {
						uncleaned = options.uncleaned.episodes.indexOf(field) >= 0;
					}

					obj[field] = getInfo(item, field, uncleaned);

					Object.assign(episode, obj);
				});
			}

			if (options.required && Array.isArray(options.required.episodes)) {
				options.required.episodes.forEach((field) => {
					if (Object.keys(episode).indexOf(field) < 0) {
						throw ERRORS.requiredError;
					}
				});
			}

			episodes.push(episode);
		});
	}

	episodes.sort((a, b) => {
		// sorts by order first, if defined, then sorts by date.
		// if multiple episodes were published at the same time,
		// they are then sorted by title
		if (a.order == b.order) {
			if (a.pubDate == b.pubDate) {
				return a.title > b.title ? -1 : 1;
			}
			return b.pubDate > a.pubDate ? 1 : -1;
		}

		if (a.order && !b.order) {
			return 1;
		}

		if (b.order && !a.order) {
			return -1;
		}

		// @ts-expect-error - order is not undefined here
		return a.order > b.order ? -1 : 1;
	});

	return episodes;
}

/*
======================
=== FEED FUNCTIONS ===
======================
*/

async function fetchFeed(
	url: string,
	init: RequestInit = {},
	timeout = 20_000,
) {
	const { headers } = init;
	const abortController = new AbortController();
	const signal = abortController.signal;

	setTimeout(() => {
		abortController.abort();
	}, timeout);

	const feedResponse = await fetch(url, { headers, signal });

	if (feedResponse.status === 401) {
		throw new Error('Unauthorized');
	}

	const feedText = await feedResponse.text();
	const feedObject = parser.parse(feedText);
	return feedObject;
}

/*
=======================
=== FINAL FUNCTIONS ===
=======================
*/

export async function getPodcastFromURL(
	{ init, timeout, url }: { init?: RequestInit; timeout?: number; url: string },
	buildParams: typeof DEFAULT = DEFAULT,
): Promise<{
	episodes: Array<PodcastEpisode>;
	meta: FeedMeta;
}> {
	console.log({ url });
	const options = buildOptions(buildParams);
	const feedResponse = await fetchFeed(url, init, timeout);
	const channel = feedResponse.rss.channel;

	const meta = createMetaObjectFromFeed(channel, options);
	const episodes = createEpisodesObjectFromFeed(channel, options);

	return { episodes, meta };
}

export function getPodcastFromXml(xml: string, params: typeof DEFAULT) {
	const options = buildOptions(params);

	const feedObject = parser.parse(xml);
	const channel = feedObject.rss.channel[0];

	const meta = createMetaObjectFromFeed(channel, options);
	const episodes = createEpisodesObjectFromFeed(channel, options);

	return { episodes, meta };
}

/*
=======================
=== HELPER FUNCTIONS ===
=======================
*/

const getItemsWithAttrs = (val, nestedTags = []) => {
	if (Array.isArray(val)) {
		const items = [];

		for (const item of val) {
			if (typeof item === 'string') {
				items.push({
					attrs: {},
					value: item,
				});
			} else if (item) {
				const finalTags = {};
				if (nestedTags && nestedTags.length > 0) {
					for (const nestedTag of nestedTags) {
						const nestedItem = getItemsWithAttrs(item[nestedTag]);
						finalTags[nestedTag] = nestedItem;
					}
				}

				items.push({
					attrs: item?.['$'] ? item['$'] : {},
					value: item._,
					...(Object.keys(finalTags).length > 0
						? { nestedTags: finalTags }
						: {}),
				});
			}
		}

		return items;
	}

	return [];
};

const convertCommaDelimitedStringToArray = (str) => {
	str = str.replaceAll(/(\r\n|\n|\r)/gm, '');
	str = str.split(',');
	return str;
};
