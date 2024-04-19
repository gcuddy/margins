import type { HTMLElement } from 'node-html-parser';

// selectors can take just a string, or a string and a string which indicates the attribute (e.g. ['time', 'datetime']), or a string and a function which takes a matching node and returns a string. please be careful with the latter.
type Selector =
	| string
	| [string, string]
	| [string, (node: HTMLElement) => string]
	| [string, string, string];
// e.g. [string,string,string] indcicates .class, attr, attrValue (after json parse)
// When indicating selectors, you can just do an array
// e.g. ['title', 'meta[name="description"]']

type Meta = Array<
	Selector | { meta: Array<string> } | ((node: HTMLElement) => string)
>;

export type Extractor = {
	author: Meta;
	// content is usually chosen with the algo - you can pass in selectors to use those instead
	// they work differently, though
	// for now, just an array of selectors to get the root element where the content is
	content?:
		| Array<string>
		| {
				clean?: Array<string>;
				selectors: Array<string>;
		  };
	date_published: Meta;
	dek: Meta;
	disableJSONLD: boolean;
	duration?: Meta;
	enclosureUrl?: Meta;
	excerpt: Meta;
	lead_image_url: Meta;
	siteName: Meta;
	title: Meta;
	/** Optionally can define type, or an array of arrays that indiciates to check for that selector and return that documenttype, a single string indicating just use that as fallback */
	type?: DocumentType | Array<[string, DocumentType] | DocumentType>;
	//todo: json-ld support in Meta
};

export type CustomExtractor = Partial<Extractor> & {
	domain: string | Array<string>;
};
