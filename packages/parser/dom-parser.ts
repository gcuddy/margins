export interface HTMLElement {
	innerText: string;
	outerHTML: string;
	querySelector: (query: string) => HTMLElement | null;
	querySelectorAll: (query: string) => HTMLElement[];
}
