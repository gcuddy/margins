export function getElementIndex(element: HTMLElement) {
	return Array.from(element.parentNode?.children ?? []).indexOf(element);
}
