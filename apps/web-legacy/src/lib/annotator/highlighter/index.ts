/**
 * @license
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-FileCopyrightText: The Apache Software Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

import { ownerDocument, toRange } from '../utils';

/**
 * Wrap each text node in a given Node or Range with a `<mark>` or other
 * element.
 *
 * If a Range is given that starts and/or ends within a Text node, that node
 * will be split in order to only wrap the contained part in the mark element.
 *
 * The highlight can be removed again by calling the function that cleans up the
 * wrapper elements. Note that this might not perfectly restore the DOM to its
 * previous state: text nodes that were split are not merged again. One could
 * consider running `range.commonAncestorContainer.normalize()` afterwards to
 * join all adjacent text nodes.
 *
 * @param target - The Node/Range containing the text. If it is a Range, note
 * that as highlighting modifies the DOM, the Range may be unusable afterwards.
 * @param tagName - The element used to wrap text nodes. Defaults to `'mark'`.
 * @param attributes - An object defining any attributes to be set on the
 * wrapper elements, e.g. its `class`.
 * @returns A function that removes the created highlight.
 *
 * @public
 */
export function highlightText(
	target: Node | Range,
	tagName = 'mark',
	attributes: Record<
		string,
		| string
		| {
				string: string;
				first: boolean;
		  }
	> = {},
	annotation?: HTMLElement,
): {
	highlightElements: HTMLElement[];
	removeHighlights: () => void;
} {
	console.log('[highlightText] target', target);
	// First put all nodes in an array (splits start and end nodes if needed)
	const nodes = textNodesInRange(toRange(target));
	// get non-text-nodes in range
	const nonTextNodes = nonTextNodesInRange(toRange(target)) ?? [];
	console.log({ textNode: nodes, nonTextNodes, target });
	// Highlight each node
	const highlightElements: HTMLElement[] = [];
	let nodeIndex = 0;
	for (const node of nodes) {
		const highlightElement = wrapNodeInHighlight(
			node,
			tagName,
			attributes,
			nodeIndex,
		);
		highlightElements.push(highlightElement);
		nodeIndex++;
	}
	for (const node of nonTextNodes) {
		const highlightElement = wrapNodeInHighlight(
			node,
			tagName,
			attributes,
			nodeIndex,
		);
		highlightElements.push(highlightElement);
		nodeIndex++;
	}

	// If it's an annotation, append a little annotation el after the last highlight element
	if (annotation) {
		const lastHighlightElement =
			highlightElements[highlightElements.length - 1];
		lastHighlightElement.after(annotation);
	}

	// Return a function that cleans up the highlightElements.
	function removeHighlights() {
		// Remove each of the created highlightElements.
		for (const highlightElement of highlightElements) {
			removeHighlight(highlightElement);
		}
	}
	return {
		removeHighlights,
		highlightElements,
	};
}

// Return an array of the text nodes in the range. Split the start and end nodes if required.
function textNodesInRange(range: Range): Text[] {
	// If the start or end node is a text node and only partly in the range, split it.
	if (isTextNode(range.startContainer) && range.startOffset > 0) {
		const endOffset = range.endOffset; // (this may get lost when the splitting the node)
		const createdNode = range.startContainer.splitText(range.startOffset);
		if (range.endContainer === range.startContainer) {
			// If the end was in the same container, it will now be in the newly created node.
			range.setEnd(createdNode, endOffset - range.startOffset);
		}
		range.setStart(createdNode, 0);
	}
	if (
		isTextNode(range.endContainer) &&
		range.endOffset < range.endContainer.length
	) {
		range.endContainer.splitText(range.endOffset);
	}

	// Collect the text nodes.
	const walker = ownerDocument(range).createTreeWalker(
		range.commonAncestorContainer,
		NodeFilter.SHOW_TEXT,
		{
			acceptNode: (node) =>
				range.intersectsNode(node)
					? NodeFilter.FILTER_ACCEPT
					: NodeFilter.FILTER_REJECT,
		},
	);
	walker.currentNode = range.startContainer;

	// // Optimise by skipping nodes that are explicitly outside the range.
	// const NodeTypesWithCharacterOffset = [
	//  Node.TEXT_NODE,
	//  Node.PROCESSING_INSTRUCTION_NODE,
	//  Node.COMMENT_NODE,
	// ];
	// if (!NodeTypesWithCharacterOffset.includes(range.startContainer.nodeType)) {
	//   if (range.startOffset < range.startContainer.childNodes.length) {
	//     walker.currentNode = range.startContainer.childNodes[range.startOffset];
	//   } else {
	//     walker.nextSibling(); // TODO verify this is correct.
	//   }
	// }

	const nodes: Text[] = [];
	if (isTextNode(walker.currentNode)) nodes.push(walker.currentNode);
	while (walker.nextNode() && range.comparePoint(walker.currentNode, 0) !== 1)
		nodes.push(walker.currentNode as Text);
	return nodes;
}

// Replace [node] with <tagName ...attributes>[node]</tagName>
function wrapNodeInHighlight(
	node: Node,
	tagName: string,
	attributes: Record<
		string,
		| string
		| {
				string: string;
				first: boolean;
		  }
	>,
	index: number,
): HTMLElement {
	const document = node.ownerDocument as Document;
	const highlightElement = document.createElement(tagName);
	Object.keys(attributes).forEach((key) => {
		const value = attributes[key];
		if (typeof value === 'string') {
			highlightElement.setAttribute(key, value);
		} else {
			const { string, first } = value;
			if (first && index === 0) {
				highlightElement.setAttribute(key, string);
			} else {
				highlightElement.setAttribute(key, string + '-' + index);
			}
		}
	});
	const tempRange = document.createRange();
	tempRange.selectNode(node);
	tempRange.surroundContents(highlightElement);
	return highlightElement;
}

// Remove a highlight element created with wrapNodeInHighlight.
export function removeHighlight(highlightElement: HTMLElement) {
	// If it has somehow been removed already, there is nothing to be done.
	if (!highlightElement.parentNode) return;
	if (highlightElement.childNodes.length === 1) {
		highlightElement.replaceWith(highlightElement.firstChild as Node);
	} else {
		// If the highlight somehow contains multiple nodes now, move them all.
		while (highlightElement.firstChild) {
			highlightElement.parentNode.insertBefore(
				highlightElement.firstChild,
				highlightElement,
			);
		}
		highlightElement.remove();
	}
}

export function isTextNode(node: Node): node is Text {
	return node.nodeType === Node.TEXT_NODE;
}

export function isImgNode(node: Node): node is HTMLImageElement {
	return node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'IMG';
}

const nonTextNodesInRange = (range: Range) => {
	console.log(range, isTextNode(range.startContainer));
	// const start = range.startContainer.childNodes[range.startOffset];
	// // todo: if istextnode endcontainer
	// const end = range.endContainer.childNodes[range.endOffset];

	if (isImgNode(range.startContainer) && range.startOffset > 0) {
		const endOffset = range.endOffset; // (this may get lost when the splitting the node)
		const createdNode = range.startContainer.splitText(range.startOffset);
		if (range.endContainer === range.startContainer) {
			// If the end was in the same container, it will now be in the newly created node.
			range.setEnd(createdNode, endOffset - range.startOffset);
		}
		range.setStart(createdNode, 0);
	}
	if (
		isImgNode(range.endContainer) &&
		range.endOffset < range.endContainer.length
	) {
		range.endContainer.splitText(range.endOffset);
	}

	const walker = ownerDocument(range).createTreeWalker(
		range.commonAncestorContainer,
		NodeFilter.SHOW_ELEMENT,
		{
			acceptNode: (node) =>
				range.intersectsNode(node)
					? NodeFilter.FILTER_ACCEPT
					: NodeFilter.FILTER_REJECT,
		},
	);
	walker.currentNode = range.startContainer;
	const nodes: Node[] = [];
	// console.log('walker', walker.currentNode);
	if (isImgNode(walker.currentNode)) nodes.push(walker.currentNode);

	// TODO: just use img by checking if nodName === 'IMG'
	while (walker.nextNode() && range.comparePoint(walker.currentNode, 0) !== 1) {
		// console.log('walker', walker.currentNode);
		if (isImgNode(walker.currentNode)) {
			// console.log('img', walker.currentNode);
			nodes.push(walker.currentNode);
		}
		// console.log(walker.currentNode);
	}
	// console.log('nontextnodes', nodes);
	return nodes;
};
