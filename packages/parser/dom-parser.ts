/**
 * Simplified HTMLElement interface for our purposes.
 */
export interface HTMLElement {
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
