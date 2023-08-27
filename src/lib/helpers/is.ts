export function isHTMLElement(element: unknown): element is HTMLElement {
	return element instanceof HTMLElement;
}

export const isBrowser = typeof document !== 'undefined';

export function isAnnotation(element: unknown): element is HTMLElement {
	return (
		isHTMLElement(element) &&
		(!!element.dataset.annotationId || !!element.closest('[data-annotation-id]'))
	);
}
