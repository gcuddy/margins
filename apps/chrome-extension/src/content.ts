import { getHighestZindex } from './utils';
import AnnotationSidebar from './components/annotation-sidebar.svelte';
import { chromeStorageKeys } from './constants';
async function handleGetHTML(sendResponse: (response: any) => void) {
	const html = document.documentElement.outerHTML;
	sendResponse({ html });
}

async function handleShowAnnotate(sendResponse: (response: any) => void) {
	const sRoot = document.createElement('div');
	const shadowRoot = sRoot.attachShadow({ mode: 'open' });
	if (sRoot.shadowRoot) {
		sRoot.shadowRoot.innerHTML = `<style>:host {all: initial;}</style>`;
	}
	document.body.appendChild(sRoot);
	// TODO: tailwind styles, eiither here or in the svelte component

	const zIndex = getHighestZindex() + 1;
	const {
		[chromeStorageKeys.userID]: userID,
		[chromeStorageKeys.sessionID]: sessionID,
	} = await chrome.storage.sync.get([
		chromeStorageKeys.userID,
		chromeStorageKeys.sessionID,
	]);

	const sidebar = new AnnotationSidebar({
		props: { sessionID, userID, zIndex },
		target: shadowRoot,
	});
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'getHTML') {
		handleGetHTML(sendResponse);
		// const html = document.documentElement.outerHTML;
		// sendResponse({ html });
	} else if (request.action === 'showAnnotate') {
		handleShowAnnotate(sendResponse);
	}

	return true;
});
