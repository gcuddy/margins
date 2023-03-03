import debounce from "lodash.debounce";
import { derived, readable } from "svelte/store";

import { browser } from "$app/environment";
import { mainEl } from "./main";

interface ISelection {
	selection: Selection | null;
	/** The DOMRect of the first range i.e. getRangeAt(0), updated on resize */
	rect?: DOMRect | undefined;
}

export default readable<ISelection>(undefined, (set) => {
	let ticking = false;
	const handleResize = () => {
		const selection = window.getSelection();
		if (selection && !selection?.isCollapsed)
			set({
				selection,
			});
		ticking = false;
	};
	const handleSelect = () => {
		const selection = document.getSelection();
		if (selection && !selection?.isCollapsed)
			set({
				selection,
			});
		ticking = false;
	};
	const removeSelectionIfGone = () => {
		const selection = document.getSelection();
		if (!selection || selection.isCollapsed) {
			set({
				selection: null,
			});
		}
		ticking = false;
	};

	const onPointerUp = () => {
		if (!ticking) {
			requestAnimationFrame(handleSelect);
			ticking = true;
		}
	};
	const onSelectionChange = () => {
		if (!ticking) {
			requestAnimationFrame(removeSelectionIfGone);
			ticking = true;
		}
	};
	const onResize = () => {
		if (!ticking) {
			requestAnimationFrame(handleResize);
			ticking = true;
		}
	};

	const onScroll = () => {
		if (!ticking) {
			requestAnimationFrame(handleResize);
			ticking = true;
		}
	};

	if (browser) document.addEventListener("pointerup", onPointerUp);
	if (browser) document.addEventListener("selectionchange", onSelectionChange);
	if (browser) window.addEventListener("resize", onResize);
	return () => {
		if (browser) document.removeEventListener("pointerup", onPointerUp);
		if (browser) document.removeEventListener("selectionchange", onSelectionChange);
		if (browser) window.removeEventListener("resize", onResize);
	};
});

export const selection = derived<typeof mainEl, ISelection>(mainEl, ($mainEl, set) => {
	console.log("running derived selection store");
	let ticking = false;
	const handleResize = () => {
		const selection = window.getSelection();
		if (selection && !selection?.isCollapsed)
			set({
				selection,
			});
		ticking = false;
	};
	const handleSelect = () => {
		const selection = document.getSelection();
		if (selection && !selection?.isCollapsed)
			set({
				selection,
			});
		ticking = false;
	};
	const removeSelectionIfGone = () => {
		const selection = document.getSelection();
		if (!selection || selection.isCollapsed) {
			set({
				selection: null,
			});
		}
		ticking = false;
	};

	const onPointerUp = () => {
		if (!ticking) {
			requestAnimationFrame(handleSelect);
			ticking = true;
		}
	};
	const onSelectionChange = () => {
		if (!ticking) {
			requestAnimationFrame(removeSelectionIfGone);
			ticking = true;
		}
	};
	const onResize = () => {
		if (!ticking) {
			requestAnimationFrame(handleResize);
			ticking = true;
		}
	};

	const onScroll = () => {
		if (!ticking) {
			requestAnimationFrame(handleResize);
			ticking = true;
		}
	};

	if (browser) document.addEventListener("pointerup", onPointerUp);
	if (browser) document.addEventListener("selectionchange", onSelectionChange);
	if (browser) window.addEventListener("resize", onResize);
	if (browser && $mainEl) $mainEl.addEventListener("scroll", onScroll);
	return () => {
		if (browser) document.removeEventListener("pointerup", onPointerUp);
		if (browser) document.removeEventListener("selectionchange", onSelectionChange);
		if (browser) window.removeEventListener("resize", onResize);
		if (browser && $mainEl) $mainEl.removeEventListener("scroll", onScroll);
	};
});
