import type { ExtractionOptions } from './index.js';
import type { HTMLElement } from '../../../dom-parser.js';
import { stripUnikelyCandidates } from '../../../lib/dom.js';

export function extractBestNode(el: HTMLElement, opts?: ExtractionOptions) {
	if (opts?.stripUnlikelyCandidates) {
		stripUnikelyCandidates(el);
	}
}
