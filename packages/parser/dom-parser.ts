/**
 * Simplified HTMLElement interface, allowing use of node-html-parser or the actual DOM.
 */
export interface HTMLElement {
	getAttribute: (name: string) => string | null | undefined;
	innerHTML: string;
	innerText?: string | null;
	outerHTML: string;
	querySelector: (query: string) => HTMLElement | null;
	querySelectorAll: (query: string) => HTMLElement[] | NodeListOf<Element>;
	textContent: string | null;
}

export type Document = {
	querySelector: (query: string) => HTMLElement | null;
	querySelectorAll: (query: string) => HTMLElement[] | NodeListOf<Element>;
};

export interface Parser {
	parse: (html: string) => Document;
}
