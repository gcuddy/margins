/**
 * Simplified HTMLElement interface, allowing use of node-html-parser or the actual DOM.
 */
export interface HTMLElement extends Node {
	appendChild: (node: Node) => void;
	getAttribute: (name: string) => string | null | undefined;
	innerHTML: string;
	nextElementSibling: HTMLElement | null;
	nextSibling: Node | null;
	outerHTML: string;
	querySelector: (query: string) => HTMLElement | null;
	querySelectorAll: (query: string) => HTMLElement[];
	remove: () => void;
	replaceWith: (node: Node) => void;
	tagName: string;
	textContent: string | null;
}

export interface Node {
	innerText?: string | null;
	nodeType: number;
	remove: () => void;
}

export type Document = {
	querySelector: (query: string) => HTMLElement | null;
	querySelectorAll: (query: string) => HTMLElement[] | NodeListOf<Element>;
};

export interface Parser {
	parse: (html: string) => Document;
}
