import type { HTMLElement } from "node-html-parser";
import type { JsonPrimitive } from "type-fest";

export const not = (el: HTMLElement | HTMLElement[], selector: string) => {
	if (Array.isArray(el)) {
		// filter using tagName
		return el.filter((e) => e.tagName.toUpperCase() !== selector.toUpperCase());
	} else {
		return el.querySelectorAll(`:not(${selector})`);
	}
};

/**
 * Tests if input is an array by trying Array.isArray and then trying Json.parse as well.
 * @param input input to test
 */
export const isJsonArray = (input: any): boolean => {
	if (Array.isArray(input)) return true;
	try {
		// let's see if it's a "secret" array hidden in a string
		return isJsonArray(JSON.parse(input));
	} catch {
		return false;
	}
};

/**
 * If the string is actually a stringified object/array, this will return the object/array. Otherwise the original input string.
 * @param input test string
 */
export const clarifyStringOrObject = (input: JsonPrimitive): any | JsonPrimitive => {
	if (typeof input !== "string") return input;
	try {
		const obj = JSON.parse(input);
		return obj;
	} catch {
		return input as JsonPrimitive;
	}
};
