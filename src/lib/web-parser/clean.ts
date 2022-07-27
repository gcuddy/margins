import type { Article, WebPage } from 'schema-dts';
import type { HTMLElement } from 'node-html-parser';
import dayjs from 'dayjs';
import type { ImageObject } from 'schema-dts';
export function fixLazyLoadedImages(root: HTMLElement) {
	const noscripts = root.querySelectorAll('noscript');
	noscripts.forEach((noscript) => {
		const img = noscript.querySelector('img:only-child');
		if (!img) {
			return;
		}
		const prev = noscript.previousElementSibling;
		if (prev && prev.tagName === 'IMG') {
			prev.replaceWith(img);
			noscript.remove();
		}
	});
	return root;
}

export function cleanJunk(root: HTMLElement) {
	const junk = root.querySelectorAll('style, script');
	junk.forEach((j) => j.remove());
	return root;
}

interface Author {
	name: string;
	url: string[];
}

interface Publisher {
	name: string;
	logo?: string;
	url: string[];
}

interface IMetadata {
	author?: Author[];
	url: string;
	title: string;
	date?: number;
	description?: string;
	image?: string;
	paywalled?: boolean;
	publisher?: Publisher;
}

export function parseJsonld(root: HTMLElement): Article | WebPage | any {
	const jsonld = root.querySelector("script[type='application/ld+json']");
	if (!jsonld) {
		return null;
	}
	const json = jsonld.innerHTML;
	const schema = JSON.parse(json);
	const title = schema.headline?.toString() || schema.name?.toString();
	const description = schema.description?.toString();
	const image =
		typeof schema.image === 'string'
			? schema.image
			: Array.isArray(schema.image)
			? (schema?.image?.[0] as ImageObject)?.url
			: null;
	const date = dayjs(schema.datePublished?.toString()).unix();
	const author =
		typeof schema.author === 'string'
			? [{ name: schema.author, url: [] }]
			: Array.isArray(schema.author)
			? schema.author.map((a: any) => ({
					name: a.name.toString(),
					url: a.sameAs.map((u: any) => u.toString())
			  }))
			: typeof schema.author === 'object'
			? [
					{
						name: schema.author?.name?.toString(),
						url: schema.author?.sameAs?.map((u: any) => u.toString())
					}
			  ]
			: [];
	return {
		title,
		description,
		image,
		date,
		author
	};
}

export function normalizeSchema(schema: Article) {
	const meta = {} as IMetadata;
	if (schema.author) {
		if (Array.isArray(schema.author)) {
			meta.author = schema.author.map((author) => ({
				name: author.name,
				url: [author.url].concat(author.sameAs || [])
			}));
		} else if (typeof schema.author === 'string') {
			meta.author = [{ name: schema.author, url: [] }];
		}
	}
	//   if (schema.publisher) {
	//     let publisher = schema.publisher;
	//     if (Array.isArray(schema.publisher)) publisher = schema.publisher[0];
	//     if (typeof publisher === "string") {
	//       meta.publisher = { name: publisher, url: [] };
	//     } else if (Object.prototype.hasOwnProperty.call(publisher, "name")) {
	//         publisher.name;
	//       meta.publisher = {
	//           name: publisher.name,
	//           url: [publisher.url].concat(publisher.sameAs || []),
	//       };
	//     }
	//   }
}
