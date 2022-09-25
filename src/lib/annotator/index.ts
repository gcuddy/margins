// This is all picked from apache-annotator

import { EmptyScopeError, TextNodeChunker } from './chunk';
import type { DescribeTextQuoteOptions, Matcher, TextQuoteSelector } from './types';
import { ownerDocument, toRange } from './utils';
import { describeTextQuote as abstractDescribeTextQuote } from './abstract/text-quote';
import { textQuoteSelectorMatcher as abstractTextQuoteSelectorMatcher } from './abstract/match-text-quote';
import { finder } from '@medv/finder';

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

export async function describeRange(range: Range, scope?: Element) {
	let start: Element | undefined;
	let curr: Node;
	curr = range.startContainer;
	while (!start) {
		if (curr instanceof Element) {
			start = curr;
		} else {
			curr = curr.parentNode;
		}
	}
	console.log(
		finder(start, {
			root: scope,
		})
	);
	console.log(await describeTextQuote(range, start));
	curr = range.endContainer;
	let end: Element | undefined;
	while (!end) {
		if (curr instanceof Element) {
			end = curr;
		} else {
			curr = curr.parentNode;
		}
	}
	console.log(
		finder(end, {
			root: scope,
		})
	);
	console.log(await describeTextQuote(range, end));
	console.log(range.startContainer instanceof Element);
	// finder(range.startContainer)
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
