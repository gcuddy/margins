/**
 * Get the ownerDocument for either a range or a node.
 *
 * @param nodeOrRange the node or range for which to get the owner document.
 */
export function ownerDocument(nodeOrRange: Node | Range): Document {
	const node = isRange(nodeOrRange) ? nodeOrRange.startContainer : nodeOrRange;
	// node.ownerDocument is null iff node is itself a Document.
	return node.ownerDocument ?? (node as Document);
}

function isRange(nodeOrRange: Node | Range): nodeOrRange is Range {
	return 'startContainer' in nodeOrRange;
}

/**
 * Returns a range that exactly selects the contents of the given node.
 *
 * This function is idempotent: If the given argument is already a range, it
 * simply returns that range.
 *
 * @param nodeOrRange The node/range to convert to a range if it is not already
 * a range.
 */
export function toRange(nodeOrRange: Node | Range): Range {
	if (isRange(nodeOrRange)) {
		return nodeOrRange;
	} else {
		const node = nodeOrRange;
		const range = ownerDocument(node).createRange();
		range.selectNodeContents(node);
		return range;
	}
}

/**
 * TextRange is a Range that guarantees to always have Text nodes as its start
 * and end nodes. To ensure the type remains correct, it also restricts usage
 * of methods that would modify these nodes (note that a user can simply cast
 * the TextRange back to a Range to remove these restrictions).
 */
export interface TextRange extends Range {
	readonly startContainer: Text;
	readonly endContainer: Text;
	cloneRange(): TextRange;

	// Allow only Text nodes to be passed to these methods.
	insertNode(node: Text): void;
	selectNodeContents(node: Text): void;
	setEnd(node: Text, offset: number): void;
	setStart(node: Text, offset: number): void;

	// Do not allow these methods to be used at all.
	selectNode(node: never): void;
	setEndAfter(node: never): void;
	setEndBefore(node: never): void;
	setStartAfter(node: never): void;
	setStartBefore(node: never): void;
	surroundContents(newParent: never): void;
}

/**
 * Normalise a {@link https://developer.mozilla.org/en-US/docs/Web/API/Range |
 * Range} such that ranges spanning the same text become exact equals.
 *
 * *Note: in this context ‘text’ means any characters, including whitespace.*

 * Normalises a range such that both its start and end are text nodes, and that
 * if there are equivalent text selections it takes the narrowest option (i.e.
 * it prefers the start not to be at the end of a text node, and vice versa).
 *
 * If there is no text between the start and end, they thus collapse onto one a
 * single position; and if there are multiple equivalent positions, it takes the
 * first one; or, if scope is passed, the first equivalent falling within scope.
 *
 * Note that if the given range does not contain non-empty text nodes, it may
 * end up pointing at a text node outside of it (before it if possible, else
 * after). If the document does not contain any text nodes, an error is thrown.
 */
export function normalizeRange(range: Range, scope?: Range): TextRange {
	const document = ownerDocument(range);
	const walker = document.createTreeWalker(document, NodeFilter.SHOW_TEXT, {
		acceptNode(node: Text) {
			return !scope || scope.intersectsNode(node)
				? NodeFilter.FILTER_ACCEPT
				: NodeFilter.FILTER_REJECT;
		}
	});

	let [startContainer, startOffset] = snapBoundaryPointToTextNode(
		range.startContainer,
		range.startOffset
	);

	// If we point at the end of a text node, move to the start of the next one.
	// The step is repeated to skip over empty text nodes.
	walker.currentNode = startContainer;
	while (startOffset === startContainer.length && walker.nextNode()) {
		startContainer = walker.currentNode as Text;
		startOffset = 0;
	}

	// Set the range’s start; note this might move its end too.
	range.setStart(startContainer, startOffset);

	let [endContainer, endOffset] = snapBoundaryPointToTextNode(range.endContainer, range.endOffset);

	// If we point at the start of a text node, move to the end of the previous one.
	// The step is repeated to skip over empty text nodes.
	walker.currentNode = endContainer;
	while (endOffset === 0 && walker.previousNode()) {
		endContainer = walker.currentNode as Text;
		endOffset = endContainer.length;
	}

	// Set the range’s end; note this might move its start too.
	range.setEnd(endContainer, endOffset);

	return range as TextRange;
}

// Given an arbitrary boundary point, this returns either:
// - that same boundary point, if its node is a text node;
// - otherwise the first boundary point after it whose node is a text node, if any;
// - otherwise, the last boundary point before it whose node is a text node.
// If the document has no text nodes, it throws an error.
function snapBoundaryPointToTextNode(node: Node, offset: number): [Text, number] {
	if (isText(node)) return [node, offset];

	// Find the node at or right after the boundary point.
	let curNode: Node;
	if (isCharacterData(node)) {
		curNode = node;
	} else if (offset < node.childNodes.length) {
		curNode = node.childNodes[offset];
	} else {
		curNode = node;
		while (curNode.nextSibling === null) {
			if (curNode.parentNode === null)
				// Boundary point is at end of document
				throw new Error('not implemented'); // TODO
			curNode = curNode.parentNode;
		}
		curNode = curNode.nextSibling;
	}

	if (isText(curNode)) return [curNode, 0];

	// Walk to the next text node, or the last if there is none.
	const document = node.ownerDocument ?? (node as Document);
	const walker = document.createTreeWalker(document, NodeFilter.SHOW_TEXT);
	walker.currentNode = curNode;
	if (walker.nextNode() !== null) {
		return [walker.currentNode as Text, 0];
	} else if (walker.previousNode() !== null) {
		return [walker.currentNode as Text, (walker.currentNode as Text).length];
	} else {
		throw new Error('Document contains no text nodes.');
	}
}

function isText(node: Node): node is Text {
	return node.nodeType === Node.TEXT_NODE;
}

function isCharacterData(node: Node): node is CharacterData {
	return (
		node.nodeType === Node.PROCESSING_INSTRUCTION_NODE ||
		node.nodeType === Node.COMMENT_NODE ||
		node.nodeType === Node.TEXT_NODE
	);
}
