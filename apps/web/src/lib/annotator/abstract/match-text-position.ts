import type { Chunk, ChunkRange, Chunker } from "../chunk";
import type { TextPositionSelector } from "../types";
import { CodePointSeeker } from "./code-point-seeker";
import { TextSeeker } from "./seeker";

/**
 * Find the range of text corresponding to the given {@link TextPositionSelector}.
 *
 * This is an abstract implementation of the function’s logic, which expects a
 * generic {@link Chunker} to represent the text, and returns an (async)
 * generator producing a single {@link ChunkRange} to represent the match.
 * (unlike e.g. TextQuoteSelector, it cannot result in multiple matches).
 *
 * See {@link dom.createTextPositionSelectorMatcher} for a
 * wrapper around this implementation which applies it to the text of an HTML
 * DOM.
 *
 * The function is curried, taking first the selector and then the text.
 *
 * @example
 * ```
 * const selector = { type: 'TextPositionSelector', start: 702, end: 736 };
 * const matches = textPositionSelectorMatcher(selector)(textChunks);
 * const match = (await matches.next()).value;
 * console.log(match);
 * // ⇒ { startChunk: { … }, startIndex: 64, endChunk: { … }, endIndex: 98 }
 * ```
 *
 * @param selector - the {@link TextPositionSelector} to be anchored
 * @returns a {@link Matcher} function that applies `selector` to a given text
 *
 * @public
 */
export function textPositionSelectorMatcher(
    selector: TextPositionSelector,
): <TChunk extends Chunk<any>>(
    scope: Chunker<TChunk>,
) => AsyncGenerator<ChunkRange<TChunk>, void, void> {
    const { start, end } = selector;

    return async function* matchAll<TChunk extends Chunk<string>>(
        textChunks: Chunker<TChunk>,
    ) {
        const codeUnitSeeker = new TextSeeker(textChunks);
        const codePointSeeker = new CodePointSeeker(codeUnitSeeker);

        codePointSeeker.seekTo(start);
        const startChunk = codeUnitSeeker.currentChunk;
        const startIndex = codeUnitSeeker.offsetInChunk;
        codePointSeeker.seekTo(end);
        const endChunk = codeUnitSeeker.currentChunk;
        const endIndex = codeUnitSeeker.offsetInChunk;

        yield { startChunk, startIndex, endChunk, endIndex };
    };
}
