// This is all picked from apache-annotator

import { textQuoteSelectorMatcher as abstractTextQuoteSelectorMatcher } from './abstract/match-text-quote';
import { describeTextQuote as abstractDescribeTextQuote } from './abstract/text-quote';
import { describeTextPosition as abstractDescribeTextPosition } from './abstract/text-position';

import { EmptyScopeError, TextNodeChunker } from './chunk';
import { isTextNode } from './highlighter';
import { buildSelectorFromImage } from './img';
import type { DescribeTextQuoteOptions, Matcher, RangeSelector, TextPositionSelector, TextQuoteSelector } from './types';
import { ownerDocument, toRange } from './utils';

/**
 * Returns a {@link TextQuoteSelector} that unambiguously describes the given
 * range of text, within the given scope.
 *
 * The selector will contain the *exact* target quote, and in case this quote
 * appears multiple times in the text, sufficient context around the quote will
 * be included in the selector’s *prefix* and *suffix* attributes to
 * disambiguate. By default, more prefix and suffix are included than strictly
 * required; both in order to be robust against slight modifications, and in an
 * attempt to not end halfway a word (mainly for the sake of human readability).
 *
 * @example
 * ```
 * const target = window.getSelection().getRangeAt(0);
 * const selector = await describeTextQuote(target);
 * console.log(selector);
 * // {
 * //   type: 'TextQuoteSelector',
 * //   exact: 'ipsum',
 * //   prefix: 'Lorem ',
 * //   suffix: ' dolor'
 * // }
 * ```
 *
 * @param range - The {@link https://developer.mozilla.org/en-US/docs/Web/API/Range
 * | Range} whose text content will be described
 * @param scope - A Node or Range that serves as the ‘document’ for purposes of
 * finding occurrences and determining prefix and suffix. Defaults to the full
 * Document that contains `range`.
 * @param options - Options to fine-tune the function’s behaviour.
 * @returns The selector unambiguously describing `range` within `scope`.
 *
 * @public
 */
export async function describeTextQuote(
	range: Range,
	scope?: Node | Range,
	options: DescribeTextQuoteOptions = {}
): Promise<TextQuoteSelector> {
	const scopeAsRange = toRange(scope ?? ownerDocument(range));

	const chunker = new TextNodeChunker(scopeAsRange);

	return await abstractDescribeTextQuote(
		chunker.rangeToChunkRange(range),
		() => new TextNodeChunker(scopeAsRange),
		options
	);
}

const NON_TEXT_TAGS = ['img', 'iframe', 'video', 'table'];

/**
 * An attempt at a "smart" describer that will either use range or not
 */
export async function describeSelection(range: Range, scope: Element) {
	if (!range.toString().trim()) {
		console.log(`[describe] no text`);
		console.log(`[describe]`, { range });
		// No text content - must just be an image!
		// todo: waht if it's a series of images?
		// use text quote refined by a css selector
		// TODO: makeRefinable to add css/xpath to make suer we just select this
		// use css/xpath selector
		const walker = ownerDocument(range).createTreeWalker(
			range.commonAncestorContainer,
			NodeFilter.SHOW_ELEMENT,
			{
				acceptNode: (node) =>
					range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
			}
		);
		console.log(walker.currentNode);
		const nodes: Node[] = [];
		while (walker.nextNode() && range.comparePoint(walker.currentNode, 0) !== 1) {
			console.log(walker.currentNode);
			if ((walker.currentNode as Element).tagName === 'IMG') {
				// todo: or others
				nodes.push(walker.currentNode);
			}
		}
		console.log({ nodes });
		// TODO: text quote refined by xpath, not just xpath
		if (nodes[0] instanceof HTMLImageElement) {
			return buildSelectorFromImage(nodes[0], scope);
		}
		if (!isTextNode(range.startContainer)) {
			range.startContainer.childNodes[range.startOffset];
			// start walking thru till we get to an img?
		}
		// console.log(buildSelectorFromImage(range.cloneContents().querySelector('img'), scope));
		// return describeRange(range, scope);
		// return describeTextQuote(range, scope, {
		// 	minimumQuoteLength: 10,
		// });
	} else if (
		!range.cloneContents().querySelector(NON_TEXT_TAGS.join(',')) &&
		range.toString().trim()
	) {
		// range contains just text
		console.log('[describe] just text');
		return describeTextQuote(range, scope);
		// use textquote
	} else {
		console.log(`[describe] combo`);
		return describeRange(range, scope);
		// create range
	}
}

export async function describeRange(range: Range, scope?: Element) {
	console.log(`describing range`);
	console.log({ range });
	const startRange = new Range();
	if (range.toString().trim()) {
		// No text content - must just be an image!
	}
	startRange.setStart(range.startContainer, range.startOffset);
	// go through till we find something to latch onto
	if (isTextNode(range.startContainer)) {
		startRange.setEnd(range.startContainer, range.startContainer.length);
		console.log({ startRange });
	} else {
		// then let's keep expanding till we find one
	}
	const start = await describeTextQuote(startRange, scope);

	// end
	const endRange = new Range();
	endRange.setStart(range.endContainer, range.endOffset);
	if (isTextNode(range.endContainer)) {
		startRange.setEnd(range.endContainer, range.endContainer.length);
	}
	const end = await describeTextQuote(endRange, scope);
	const selector: RangeSelector = {
		type: 'RangeSelector',
		startSelector: start,
		endSelector: end,
	};
	return selector;
	// let start: Element | undefined;
	// let curr: Node;
	// curr = range.startContainer;
	// while (!start) {
	// 	if (curr instanceof Element) {
	// 		start = curr;
	// 	} else {
	// 		curr = curr.parentNode;
	// 	}
	// }
	// console.log(
	// 	finder(start, {
	// 		root: scope,
	// 	})
	// );
	// console.log(await describeTextQuote(range, start));
	// curr = range.endContainer;
	// let end: Element | undefined;
	// while (!end) {
	// 	if (curr instanceof Element) {
	// 		end = curr;
	// 	} else {
	// 		curr = curr.parentNode;
	// 	}
	// }
	// console.log(
	// 	finder(end, {
	// 		root: scope,
	// 	})
	// );
	// console.log(await describeTextQuote(range, end));
	// console.log(range.startContainer instanceof Element);
	// // finder(range.startContainer)
}
/**
 * Find occurrences in a text matching the given {@link
 * TextQuoteSelector}.
 *
 * This performs an exact search for the selector’s quote (including prefix and
 * suffix) within the text contained in the given scope (a  {@link
 * https://developer.mozilla.org/en-US/docs/Web/API/Range | Range}).
 *
 * Note the match is based on strict character-by-character equivalence, i.e.
 * it is sensitive to whitespace, capitalisation, etc.
 *
 * The function is curried, taking first the selector and then the scope.
 *
 * As there may be multiple matches for a given selector (when its prefix and
 * suffix attributes are not sufficient to disambiguate it), the matcher will
 * return an (async) generator that produces each match in the order they are
 * found in the text.
 *
 * *XXX Modifying the DOM (e.g. to highlight the text) while the search is still
 * running can mess up and result in an error or an infinite loop. See [issue
 * #112](https://github.com/apache/incubator-annotator/issues/112).*
 *
 * @example
 * ```
 * // Find the word ‘banana’.
 * const selector = { type: 'TextQuoteSelector', exact: 'banana' };
 * const scope = document.body;
 *
 * // Read all matches.
 * const matches = textQuoteSelectorMatcher(selector)(scope);
 * for await (match of matches) console.log(match);
 * // ⇒ Range { startContainer: #text, startOffset: 187, endContainer: #text,
 * //   endOffset: 193, … }
 * // ⇒ Range { startContainer: #text, startOffset: 631, endContainer: #text,
 * //   endOffset: 637, … }
 * ```
 *
 * @param selector - The {@link TextQuoteSelector} to be anchored.
 * @returns A {@link Matcher} function that applies `selector` within a given
 * `scope`.
 *
 * @public
 */
export function createTextQuoteSelectorMatcher(
	selector: TextQuoteSelector
): Matcher<Node | Range, Range> {
	const abstractMatcher = abstractTextQuoteSelectorMatcher(selector);

	return async function* matchAll(scope) {
		let textChunks;
		try {
			textChunks = new TextNodeChunker(scope);
		} catch (err) {
			// An empty range contains no matches.
			if (err instanceof EmptyScopeError) return;
			else throw err;
		}

		for await (const abstractMatch of abstractMatcher(textChunks)) {
			yield textChunks.chunkRangeToRange(abstractMatch);
		}
	};
}

/**
 * Returns a {@link TextPositionSelector} that points at the target text within
 * the given scope.
 *
 * When no scope is given, the position is described relative to the document
 * as a whole. Note this means all the characters in all Text nodes are counted
 * to determine the target’s position, including those in the `<head>` and
 * whitespace, hence even a minor modification could make the selector point to
 * a different text than its original target.
 *
 * @example
 * ```
 * const target = window.getSelection().getRangeAt(0);
 * const selector = await describeTextPosition(target);
 * console.log(selector);
 * // {
 * //   type: 'TextPositionSelector',
 * //   start: 702,
 * //   end: 736
 * // }
 * ```
 *
 * @param range - The {@link https://developer.mozilla.org/en-US/docs/Web/API/Range
* | Range} whose text content will be described.
* @param scope - A Node or Range that serves as the ‘document’ for purposes of
* finding occurrences and determining prefix and suffix. Defaults to the full
* Document that contains `range`.
* @returns The selector describing `range` within `scope`.
*
* @public
*/
export function describeTextPosition(
	range: Range,
	scope?: Node | Range,
): TextPositionSelector {
	scope = toRange(scope ?? ownerDocument(range));

	const textChunks = new TextNodeChunker(scope);
	if (textChunks.currentChunk === null)
		throw new RangeError('Scope does not contain any Text nodes.');

	return abstractDescribeTextPosition(
		textChunks.rangeToChunkRange(range),
		textChunks,
	);
}