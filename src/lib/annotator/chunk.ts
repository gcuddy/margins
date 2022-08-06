import { normalizeRange, ownerDocument, toRange } from './utils';

export interface PartialTextNode extends Chunk<string> {
	readonly node: Text;
	readonly startOffset: number;
	readonly endOffset: number;
}

export class EmptyScopeError extends TypeError {
	constructor(message?: string) {
		super(message || 'Scope contains no text nodes.');
	}
}

export class OutOfScopeError extends TypeError {
	constructor(message?: string) {
		super(message || 'Cannot convert node to chunk, as it falls outside of chunker’s scope.');
	}
}

export class TextNodeChunker implements Chunker<PartialTextNode> {
	private scope: Range;
	private iter: NodeIterator;

	get currentChunk(): PartialTextNode {
		const node = this.iter.referenceNode;

		// This test should not actually be needed, but it keeps TypeScript happy.
		if (!isText(node)) throw new EmptyScopeError();

		return this.nodeToChunk(node);
	}

	nodeToChunk(node: Text): PartialTextNode {
		if (!this.scope.intersectsNode(node)) throw new OutOfScopeError();

		const startOffset = node === this.scope.startContainer ? this.scope.startOffset : 0;
		const endOffset = node === this.scope.endContainer ? this.scope.endOffset : node.length;

		return {
			node,
			startOffset,
			endOffset,
			data: node.data.substring(startOffset, endOffset),
			equals(other) {
				return (
					other.node === this.node &&
					other.startOffset === this.startOffset &&
					other.endOffset === this.endOffset
				);
			}
		};
	}

	rangeToChunkRange(range: Range): ChunkRange<PartialTextNode> {
		range = range.cloneRange();

		// Take the part of the range that falls within the scope.
		if (range.compareBoundaryPoints(Range.START_TO_START, this.scope) === -1)
			range.setStart(this.scope.startContainer, this.scope.startOffset);
		if (range.compareBoundaryPoints(Range.END_TO_END, this.scope) === 1)
			range.setEnd(this.scope.endContainer, this.scope.endOffset);

		// Ensure it starts and ends at text nodes.
		const textRange = normalizeRange(range, this.scope);

		const startChunk = this.nodeToChunk(textRange.startContainer);
		const startIndex = textRange.startOffset - startChunk.startOffset;
		const endChunk = this.nodeToChunk(textRange.endContainer);
		const endIndex = textRange.endOffset - endChunk.startOffset;

		return { startChunk, startIndex, endChunk, endIndex };
	}

	chunkRangeToRange(chunkRange: ChunkRange<PartialTextNode>): Range {
		const range = ownerDocument(this.scope).createRange();
		// The `+…startOffset` parts are only relevant for the first chunk, as it
		// might start within a text node.
		range.setStart(
			chunkRange.startChunk.node,
			chunkRange.startIndex + chunkRange.startChunk.startOffset
		);
		range.setEnd(chunkRange.endChunk.node, chunkRange.endIndex + chunkRange.endChunk.startOffset);
		return range;
	}

	/**
	 * @param scope A Range that overlaps with at least one text node.
	 */
	constructor(scope: Node | Range) {
		this.scope = toRange(scope);
		this.iter = ownerDocument(scope).createNodeIterator(
			this.scope.commonAncestorContainer,
			NodeFilter.SHOW_TEXT,
			{
				acceptNode: (node: Text) => {
					return this.scope.intersectsNode(node)
						? NodeFilter.FILTER_ACCEPT
						: NodeFilter.FILTER_REJECT;
				}
			}
		);

		// Move the iterator to after the start (= root) node.
		this.iter.nextNode();
		// If the start node is not a text node, move it to the first text node.
		if (!isText(this.iter.referenceNode)) {
			const nextNode = this.iter.nextNode();
			if (nextNode === null) throw new EmptyScopeError();
		}
	}

	nextChunk(): PartialTextNode | null {
		// Move the iterator to after the current node, so nextNode() will cause a jump.
		if (this.iter.pointerBeforeReferenceNode) this.iter.nextNode();

		if (this.iter.nextNode()) return this.currentChunk;
		else return null;
	}

	previousChunk(): PartialTextNode | null {
		if (!this.iter.pointerBeforeReferenceNode) this.iter.previousNode();

		if (this.iter.previousNode()) return this.currentChunk;
		else return null;
	}

	precedesCurrentChunk(chunk: PartialTextNode): boolean {
		if (this.currentChunk === null) return false;
		return !!(
			this.currentChunk.node.compareDocumentPosition(chunk.node) & Node.DOCUMENT_POSITION_PRECEDING
		);
	}
}

function isText(node: Node): node is Text {
	return node.nodeType === Node.TEXT_NODE;
}

// **** //

/**
 * Represents a piece of text in any kind of ‘file’.
 *
 * Its purpose is to enable generic algorithms to deal with text content of any
 * type of ‘file’ that consists of many pieces of text (e.g. a DOM, PDF, …).
 * Each Chunk represents one piece of text ({@link Chunk.data}). An object
 * implementing this interface would typically have other attributes as well to
 * map the chunk back to its position in the file (e.g. a Text node in the DOM).
 *
 * @typeParam TData - Piece of text, typically `string`
 *
 * @public
 */
export interface Chunk<TData> {
	/**
	 * The piece of text this chunk represents.
	 */
	readonly data: TData;
	equals?(otherChunk: this): boolean;
}

/**
 * Test two {@link Chunk}s for equality.
 *
 * Equality here means that both represent the same piece of text (i.e. at the
 * same position) in the file. It compares using the custom {@link Chunk.equals}
 * method if either chunk defines one, and falls back to checking the objects’
 * identity (i.e. `chunk1 === chunk2`).
 *
 * @public
 */
export function chunkEquals(chunk1: Chunk<any>, chunk2: Chunk<any>): boolean {
	if (chunk1.equals) return chunk1.equals(chunk2);
	if (chunk2.equals) return chunk2.equals(chunk1);
	return chunk1 === chunk2;
}

/**
 * Points at a range of characters between two points inside {@link Chunk}s.
 *
 * Analogous to the DOM’s ({@link https://developer.mozilla.org/en-US/docs/Web/API/AbstractRange
 * | Abstract}){@link https://developer.mozilla.org/en-US/docs/Web/API/Range |
 * Range}. Each index expresses an offset inside the value of the corresponding
 * {@link Chunk.data}, and can equal the length of that data in order to point
 * to the position right after the chunk’s last character.
 *
 * @public
 */
export interface ChunkRange<TChunk extends Chunk<any>> {
	startChunk: TChunk;
	startIndex: number;
	endChunk: TChunk;
	endIndex: number;
}

/**
 * Test two {@link ChunkRange}s for equality.
 *
 * Equality here means equality of each of their four properties (i.e.
 * {@link startChunk}, {@link startIndex},
 * {@link endChunk}, and {@link endIndex}).
 * For the `startChunk`s and `endChunk`s, this function uses the custom
 * {@link Chunk.equals} method if defined.
 *
 * Note that if the start/end of one range points at the end of a chunk, and the
 * other to the start of a subsequent chunk, they are not considered equal, even
 * though semantically they may be representing the same range of characters. To
 * test for such semantic equivalence, ensure that both inputs are normalised:
 * typically this means the range is shrunk to its narrowest equivalent, and (if
 * it is empty) positioned at its first equivalent.
 *
 * @public
 */
export function chunkRangeEquals(range1: ChunkRange<any>, range2: ChunkRange<any>): boolean {
	return (
		chunkEquals(range1.startChunk, range2.startChunk) &&
		chunkEquals(range1.endChunk, range2.endChunk) &&
		range1.startIndex === range2.startIndex &&
		range1.endIndex === range2.endIndex
	);
}

/**
 * Presents the pieces of text contained in some underlying ‘file’ as a sequence
 * of {@link Chunk}s.
 *
 * Rather than presenting a list of all pieces, the `Chunker` provides methods
 * to walk through the file piece by piece. This permits implementations to read
 * and convert the file to `Chunk`s lazily.
 *
 * For those familiar with the DOM APIs, it is similar to a NodeIterator (but
 * unlike NodeIterator, it has no concept of being ‘before’ or ‘after’ a chunk).
 *
 * @typeParam TChunk - (sub)type of `Chunk` being used.
 *
 * @public
 */
export interface Chunker<TChunk extends Chunk<any>> {
	/**
	 * The chunk currently being pointed at.
	 *
	 * Initially, this should normally be the first chunk in the file.
	 */
	readonly currentChunk: TChunk;

	/**
	 * Point {@link currentChunk} at the chunk following it, and return that chunk.
	 * If there are no chunks following it, keep `currentChunk` unchanged and
	 * return null.
	 */
	nextChunk(): TChunk | null;

	/**
	 * Point {@link currentChunk} at the chunk preceding it, and return that chunk.
	 * If there are no chunks preceding it, keep `currentChunk` unchanged and
	 * return null.
	 */
	previousChunk(): TChunk | null;

	/**
	 * Test if a given `chunk` is before the {@link currentChunk|current
	 * chunk}.
	 *
	 * Returns true if `chunk` is before `this.currentChunk`, false otherwise
	 * (i.e. if `chunk` follows it or is the current chunk).
	 *
	 * The given `chunk` need not necessarily be obtained from the same `Chunker`,
	 * but the chunkers would need to represent the same file. Otherwise behaviour
	 * is unspecified (an implementation might throw or just return `false`).
	 *
	 * @param chunk - A chunk, typically obtained from the same `Chunker`.
	 */
	precedesCurrentChunk(chunk: TChunk): boolean;
}
