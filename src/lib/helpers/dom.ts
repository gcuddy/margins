export function getElementIndex(element: HTMLElement) {
	return Array.from(element.parentNode?.children ?? []).indexOf(element);
}

export function checkIfKeyboardEventsAllowed(el = document.activeElement) {
	console.log('checking if keyboard events allowed');
	if (el?.matches('input, textarea, select, [contenteditable]')) {
		return false;
	}
	// const allowedCheck = !document.activeElement?.matches(allowed);
	if (document.activeElement === document.body) {
		return true;
	}

	if (el?.closest('input, textarea, select, [contenteditable]') !== null) {
		return false;
	}

	const dialogEls = document.querySelectorAll(
		'[role="dialog"][data-state="open"]',
	);
	// console.log({ dialogEls });
	if (dialogEls.length > 0) {
		return false;
	}

	return true;
}


export function getHTMLOfSelection() {
	const range = window.getSelection()?.getRangeAt(0);
	const container = document.createElement('div');
	container.appendChild(range?.cloneContents() ?? document.createTextNode(''));
	return container.innerHTML;
}
