import type { EventBus, PDFLinkService, PDFViewer } from 'pdfjs-dist/web/pdf_viewer';
import { getContext, setContext } from 'svelte';
import { persisted } from 'svelte-local-storage-store';
import { Writable, get, writable } from 'svelte/store';

const InvisibleCharactersRegExp = /[\x01-\x1F]/g;

export function removeNullCharacters(str: string, replaceInvisible = false) {
	if (typeof str !== 'string') {
		console.error(`The argument must be a string.`);
		return str;
	}
	if (replaceInvisible) {
		str = str.replaceAll(InvisibleCharactersRegExp, ' ');
	}
	return str.replaceAll('\x00', '');
}

export const RenderingStates = {
	INITIAL: 0,
	RUNNING: 1,
	PAUSED: 2,
	FINISHED: 3,
} as const;
export type RenderingState =
	(typeof RenderingStates)[keyof typeof RenderingStates];

/**
 * Scale factors for the canvas, necessary with HiDPI displays.
 */
export class OutputScale {
	sx: number;
	sy: number;
	constructor() {
		const pixelRatio = window.devicePixelRatio || 1;

		/**
		 * @type {number} Horizontal scale.
		 */
		this.sx = pixelRatio;

		/**
		 * @type {number} Vertical scale.
		 */
		this.sy = pixelRatio;
	}

	/**
	 * @type {boolean} Returns `true` when scaling is required, `false` otherwise.
	 */
	get scaled() {
		return this.sx !== 1 || this.sy !== 1;
	}
}

// function createOutputScale() {

//     type Scale = {
//         sx: number;
//         sy: number;
//     }
//     const pixelRatio = window.devicePixelRatio || 1;

//     const store = writable<Scale>({
//         sx: pixelRatio,
//         sy: pixelRatio
//     });

//     return {
//         ...store,
//         scaled() {
//             // REVIEW: this can't be the best way to do this, can it?
//             const scale = get(store);
//             return scale.sx !== 1 || scale.sy !== 1;
//         }
//     }
// }

/**
 *  Approximates float number as a fraction using Farey sequence (max order
 *  of 8).
 *  @param {number} x - Positive float number.
 *  @returns {Array} Estimated fraction: the first array item is a numerator,
 *                   the second one is a denominator.
 */
export function approximateFraction(x: number) {
	// Fast paths for int numbers or their inversions.
	if (Math.floor(x) === x) {
		return [x, 1];
	}
	const xinv = 1 / x;
	const limit = 8;
	if (xinv > limit) {
		return [1, limit];
	} else if (Math.floor(xinv) === xinv) {
		return [1, xinv];
	}

	const x_ = x > 1 ? xinv : x;
	// a/b and c/d are neighbours in Farey sequence.
	let a = 0,
		b = 1,
		c = 1,
		d = 1;
	// Limiting search to order 8.
	while (true) {
		// Generating next term in sequence (order of q).
		const p = a + c,
			q = b + d;
		if (q > limit) {
			break;
		}
		if (x_ <= p / q) {
			c = p;
			d = q;
		} else {
			a = p;
			b = q;
		}
	}
	let result;
	// Select closest of the neighbours to x.
	if (x_ - a / b < c / d - x_) {
		result = x_ === x ? [a, b] : [b, a];
	} else {
		result = x_ === x ? [c, d] : [d, c];
	}
	return result;
}

export function roundToDivide(x: number, div: number) {
	const r = x % div;
	return r === 0 ? x : Math.round(x - r + div);
}

type PdfState = {
	event_bus: EventBus | null;
	opts: Writable<{
		darkModeInvert: boolean;
		scale: number | 'page-fit' | 'page-width' | 'auto';
	}>;
    pageNumber: number;
    pdf_link_service: PDFLinkService | null;
	pdf_viewer: PDFViewer | null;

};
const MIN_SCALE = 0.5;
const MAX_SCALE = 2.3;

function pdf_state() {
	const { subscribe, set, update } = writable<PdfState>({
		event_bus: null,
		opts: writable({
			darkModeInvert: false,
			scale: 'auto',
		}),
        pageNumber: 1,
        pdf_link_service: null,
		pdf_viewer: null,
	});

	function zoom(dir: 'in' | 'out') {
		update((state) => {
			if (!state.pdf_viewer) return state;
			// if (typeof state.scale !== 'number') return state;
			if (state.pdf_viewer.currentScale <= MAX_SCALE) {
				const scale =
					dir === 'in'
						? state.pdf_viewer.currentScale + 0.1
						: state.pdf_viewer.currentScale - 0.1;
				state.pdf_viewer.currentScale = scale;
				// set opts
				state.opts.update((opts) => ({ ...opts, scale }));
			}
			return state;
		});
	}

	return {
		set,
		subscribe,
		update,
		zoomIn: () => {
			zoom('in');
		},
		zoomOut: () => {
			zoom('out');
		},
	};
}

export function createPdfStateContext() {
	const pdfState = pdf_state();

	setContext('pdfState', pdfState);

	return pdfState;
}

export function getPdfStateContext() {
	const ctx = getContext('pdfState');
	if (!ctx) {
		throw new Error('pdfState context not found');
	}
	return ctx as ReturnType<typeof createPdfStateContext>;
}
