import type { Document, HTMLElement } from '@margins/parser';

export function getDomainName(
	html: HTMLElement | Document,
): string | undefined {
	let domain = html
		.querySelector(`link[rel="canonical"]`)
		?.getAttribute('href');
	if (domain) {
		try {
			const { hostname, protocol } = new URL(domain);
			domain = `${protocol}//${hostname}`;
			return domain;
		} catch {
			return undefined;
		}
	}
	return undefined;
}
