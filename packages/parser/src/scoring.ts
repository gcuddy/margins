import { Node, HTMLElement, parse } from 'node-html-parser';
import {
	FOOTNOTE_HINT_RE,
	hasSentencend,
	NEGATIVE_SCORE_RE,
	NON_TOP_CANDIDATE_TAGS_RE,
	PHOTO_HINTS_RE,
	POSITIVE_SCORE_RE
} from './constants';
let nodeScoreMap: Map<HTMLElement, number>;

function updateScore(node: HTMLElement, score: number | ((n: number) => number)) {
	const currentScore = nodeScoreMap.get(node);
	if (!currentScore) return;
	if (typeof score === 'number') {
		nodeScoreMap.set(node, currentScore + score);
	} else {
		nodeScoreMap.set(node, score(currentScore));
	}
}

function compareScores(a: HTMLElement | number, b: HTMLElement | number) {
	if (!a && a !== 0) return false;
	if (!b && b !== 0) return true;
	const a_score = typeof a === 'number' ? a : nodeScoreMap.get(a);
	const b_score = typeof b === 'number' ? b : nodeScoreMap.get(b);
	if (a_score && b_score) {
		return a_score >= b_score;
	} else if (a_score && !b_score) {
		return true;
	}
	return false;
}

function getWeight(el: HTMLElement) {
	// TODO: setting to turn this off
	let weight = 0;
	// to think about: is it better to use simple regex, or match within domtokenlist?
	const classNames = el.classList.toString();
	if (el.id) {
		// testing out ids being worth a bit more...
		if (NEGATIVE_SCORE_RE.test(el.id)) weight -= 30;
		if (POSITIVE_SCORE_RE.test(el.id)) weight += 30;
	}
	if (classNames) {
		// test classname and add/subtract points depending on match
		if (NEGATIVE_SCORE_RE.test(classNames)) weight -= 25;
		if (POSITIVE_SCORE_RE.test(classNames)) weight += 25;
		// try to keep photos
		if (PHOTO_HINTS_RE.test(classNames)) weight += 15;
	}

	return weight;
}

function initializeNode(node: HTMLElement) {
	nodeScoreMap.set(node, 0);
	// Modifiying this slightly from arc90 to get with the times (stolen from Mercury-Parser's constants)
	switch (node.tagName) {
		case 'DIV': {
			updateScore(node, 5);
			break;
		}
		case 'PRE':
		case 'TD':
		case 'OL':
		case 'UL':
		case 'DL':
		case 'BLOCKQUOTE': {
			updateScore(node, 3);
			break;
		}
		case 'ADDRESS':
		case 'FORM':
			updateScore(node, -3);
			break;
		case 'TH':
			updateScore(node, -5);
			break;
	}
	updateScore(node, getWeight(node));
}

/**
 * Gets density of links as percentage of content
 *  is the amount of text that is inside a link divided by the total text in the node
 * @param container HTMLElement that contains content to test
 * @return {number} float
 */
function getLinkDensity(container: HTMLElement) {
	const links = container.querySelectorAll('a');
	const textLength = container.innerText.length;
	const linkLength = links.reduce((acc: number, el: HTMLElement) => acc + el.innerText.length, 0);
	if (!textLength && linkLength) return 1;
	if (textLength) return linkLength / textLength;
	return 0;
}

function mergeSiblings(topCandidate: HTMLElement) {
	const topCandidateScore = nodeScoreMap.get(topCandidate);
	if (!topCandidateScore) return; // todo: throw error?
	// mercury-parser uses .25, arc90 uses .2,
	const siblingScoreThreshold = Math.max(10, topCandidateScore * 0.25);
	const wrapper = parse('<div></div>');
	const siblingNodes = topCandidate.parentNode.childNodes;

	// loop thru all siblings
	// add ones that score high enough to a wrapper div that will hold our content
	let index = 0;
	for (const siblingNode of siblingNodes) {
		index++; // <- this is a ONE-BASED index, not zero-based (matches with length)
		// taken from mercury parser
		let siblingCandidate: HTMLElement | undefined = undefined;
		if (siblingNode.nodeType === 1) {
			siblingCandidate = siblingNode as HTMLElement;
		}
		if (!siblingCandidate) continue;
		if (NON_TOP_CANDIDATE_TAGS_RE.test(siblingCandidate.tagName)) continue;
		const siblingScore = nodeScoreMap.get(siblingCandidate);
		if (!siblingScore) continue;
		//   if it's actually the top candidate, then append to our wrapper
		if (siblingCandidate === topCandidate) {
			wrapper.appendChild(siblingCandidate);
			continue;
		}
		// score the siblingCandidate now
		let contentBonus = 0;

		// give a bonus if sibling nodes and top candidates have the example same classname
		if (siblingCandidate.classList.toString() === topCandidate.classList.toString()) {
			contentBonus += topCandidateScore * 0.2;
		}
		// now let's test link density
		const linkDensity = getLinkDensity(siblingCandidate);
		// give it a small bonus if it has a low link density, give it a penalty if it's highger
		if (linkDensity < 0.05) {
			contentBonus += 20;
		} else if (linkDensity >= 0.5) {
			contentBonus -= 20;
		}
		const newScore = siblingScore + contentBonus;
		console.log(
			`Looking at sibling ${siblingCandidate.tagName}.${siblingCandidate.classNames} with score ${siblingScore}`
		);
		if (newScore >= siblingScoreThreshold) {
			wrapper.appendChild(siblingCandidate);
			console.log(`Added`);
			continue;
		}
		// let's do further inspecting if it's a P
		if (siblingCandidate.tagName === 'P') {
			const siblingContent = siblingCandidate.innerText;
			const siblingContentLength = siblingContent.length;
			if (siblingContentLength > 80 && linkDensity < 0.25) {
				wrapper.appendChild(siblingCandidate);
				console.log(`Added`);
				continue;
			}
			if (siblingContentLength <= 80 && linkDensity === 0 && hasSentencend(siblingContent)) {
				wrapper.appendChild(siblingCandidate);
				console.log(`Added`);
				continue;
			}
		}
		// make sure div.footnotes gets added
		if (siblingNodes.length - index <= 2) {
			// it's in the last couple of nodes
			if (
				FOOTNOTE_HINT_RE.test(siblingCandidate.classList.toString()) ||
				FOOTNOTE_HINT_RE.test(siblingCandidate.id)
			) {
				wrapper.appendChild(siblingCandidate);
				console.log(`Added`);
				continue;
			}
		}
	}
	// todo: arc90 turns nodes into divs if they're not divs or ps https://github.com/masukomi/arc90-readability/blob/aca36d14c6a4096d0dcaea94539d4576a485abff/js/readability.js#L930
	return wrapper;
}

export function scoreNodes(nodes: (Node | HTMLElement)[]) {
	// init map
	nodeScoreMap = new Map();
	// TODO: this function is a bit unwiedly, maybe we should refactor it
	for (const node of nodes) {
		const parent = node.parentNode;
		// console.log({ parent });
		const grandparent = parent?.parentNode;
		// console.log({ grandparent });
		const text = node.innerText;

		//   skip if no parent or text is less than 25
		if (!parent) continue;
		if (text.length < 25) continue;

		//   initialize parent & grandparent nodes if they're not in our map
		if (!nodeScoreMap.has(parent)) {
			initializeNode(parent);
		}
		if (grandparent && !nodeScoreMap.has(grandparent)) {
			initializeNode(grandparent);
		}

		// now score the paragraph itself (which we're in)
		// should this be a separate function?
		let score = 1; // starting at 1 as a base

		// add points for commas (idk, everyone seems to do this, seems arbitrary)
		score += text.split(',').length;

		// add another point (up to 3 points) for every 50 chars in the paragraph (readability does 100 chars, but i like mercury-parser doing 50)
		score += Math.min(Math.floor(text.length / 50), 3);

		// arbitrarily adding 2/3 to parent and 1/3 to grandparent
		// readability adds full to parent and 1/2 to grandparent
		// mercury-parser add .25 to parent and 0 to grandparent...
		updateScore(parent, score * (2 / 3));
		if (grandparent) updateScore(grandparent, score * (1 / 3));
	}

	// update scores with link density - can we do that before?
	let topCandidate: HTMLElement | undefined = undefined;
	for (const [el] of nodeScoreMap) {
		updateScore(el, (score) => score * (1 - getLinkDensity(el)));
		if (!topCandidate || compareScores(el, topCandidate)) {
			topCandidate = el;
		}
	}
	if (!topCandidate) {
		// todo
		// if there's no topcandidate set to body?
	}
	// now merge all its siblings to create our article, before processing
	console.log({ topCandidateSibling: topCandidate?.previousElementSibling });
	//   topCandidate = mergeSiblings(topCandidate as HTMLElement);

	// TODO: Cleaning/prepping article
	// look in arc90 preparticle and mercury-parser cleaners/content
	// TODO: next page link

	// we should also run a check to see if the top candidate is usable

	// we also need to get the proper metadata
	return topCandidate;
}
