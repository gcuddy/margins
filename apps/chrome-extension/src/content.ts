import { getHighestZindex } from './utils';
import AnnotationSidebar from './components/annotation-sidebar.svelte';
import type { ComponentProps } from 'svelte';
async function handleGetHTML(sendResponse: (response: any) => void) {
	const html = document.documentElement.outerHTML;
	sendResponse({ html });
}

async function handleShowAnnotate(
	sendResponse: (response: any) => void,
	props: ComponentProps<AnnotationSidebar>,
) {
	const sRoot = document.createElement('div');
	const shadowRoot = sRoot.attachShadow({ mode: 'open' });
	if (sRoot.shadowRoot) {
		sRoot.shadowRoot.innerHTML = `<style>:host {all: initial;}</style>`;
	}
	document.body.appendChild(sRoot);
	// TODO: tailwind styles, eiither here or in the svelte component

	const sidebar = new AnnotationSidebar({
		props,
		target: shadowRoot,
	});
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'getHTML') {
		handleGetHTML(sendResponse);
		// const html = document.documentElement.outerHTML;
		// sendResponse({ html });
	} else if (request.action === 'showAnnotate') {
		const zIndex = getHighestZindex() + 1;
		handleShowAnnotate(sendResponse, {
			zIndex,
		});
	}

	return true;
});
