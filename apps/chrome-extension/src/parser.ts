import type { Document } from '@margins/parser';
const domParser = new DOMParser();
const parse = (html: string) => {
	const parse = domParser.parseFromString(html, 'text/html');

	const querySelectorAll = (selector: string) => {
		return Array.from(parse.querySelectorAll(selector));
	};

	const querySelector = (selector: string) => {
		return parse.querySelector(selector);
	};

	return {
		querySelector,
		querySelectorAll,
	} as Document;
};
export const parser = { parse };
