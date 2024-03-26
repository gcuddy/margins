// heavily based on https://github.com/mozilla/readability/blob/main/Readability-readerable.js

import type { HTMLElement as NHTMLElement } from "node-html-parser";

type El = HTMLElement | NHTMLElement | Element;

// allows you to check if documeent is reader-able without parsing it entirely

const REGEXPS = {
	// NOTE: These two regular expressions are duplicated in
	// Readability.js. Please keep both copies in sync.
	unlikelyCandidates:
		/-ad-|ai2html|banner|breadcrumbs|combx|comment|community|cover-wrap|disqus|extra|footer|gdpr|header|legends|menu|related|remark|replies|rss|shoutbox|sidebar|skyscraper|social|sponsor|supplemental|ad-break|agegate|pagination|pager|popup|yom-remote/i,
	okMaybeItsACandidate: /and|article|body|column|content|main|shadow/i,
};

function isNodeVisible(node: El) {
	// Have to null-check node.style and node.className.indexOf to deal with SVG and MathML nodes.
	return (
		(!node.hasAttribute("style") || node.getAttribute("style") != "none") &&
		!node.hasAttribute("hidden") &&
		//check for "fallback-image" so that wikimedia math images are displayed
		(!node.hasAttribute("aria-hidden") ||
			node.getAttribute("aria-hidden") != "true" ||
			(node.classList && node.classList.contains("fallback-image")))
	);
}

/**
 * Decides whether or not the document is reader-able without parsing the whole thing.
 * @param {Object} options Configuration object.
 * @param {number} [options.minContentLength=140] The minimum node content length used to decide if the document is readerable.
 * @param {number} [options.minScore=20] The minumum cumulated 'score' used to determine if the document is readerable.
 * @param {Function} [options.visibilityChecker=isNodeVisible] The function used to determine if a node is visible.
 * @return {boolean} Whether or not we suspect Readability.parse() will suceeed at returning an article object.
 */
export function isProbablyReaderable(
	doc: Document | El,
	options = {
		minScore: 20,
		minContentLength: 140,
		visibilityChecker: isNodeVisible,
	}
) {
	// For backward compatibility reasons 'options' can either be a configuration object or the function used
	// to determine if a node is visible.
	let nodes = [...doc.querySelectorAll("p, pre, article")];

	// Get <div> nodes which have <br> node(s) and append them into the `nodes` variable.
	// Some articles' DOM structures might look like
	// <div>
	//   Sentences<br>
	//   <br>
	//   Sentences<br>
	// </div>
	const brNodes = doc.querySelectorAll("div > br");
	if (brNodes.length) {
		const set = new Set(nodes);
		brNodes.forEach((node) => {
			const parent = node.parentNode;
			if (parent) {
				set.add(parent as El);
			}
		});
		nodes = Array.from(set);
	}

	let score = 0;
	// This is a little cheeky, we use the accumulator 'score' to decide what to return from
	// this callback:
	return nodes.some((node) => {
		if (!options.visibilityChecker(node)) return false;
		const matchString = node.classList.toString() + " " + node.id;
		if (REGEXPS.unlikelyCandidates.test(matchString) && !REGEXPS.okMaybeItsACandidate.test(matchString)) {
			return false;
		}
		// if (node.matches("li p")) {
		// 	return false;
		// }
		// node.

		const textContentLength = node.textContent?.trim().length || 0;
		if (textContentLength < options.minContentLength) {
			return false;
		}

		score += Math.sqrt(textContentLength - options.minContentLength);

		if (score > options.minScore) {
			return true;
		}
		return false;
	});
}
