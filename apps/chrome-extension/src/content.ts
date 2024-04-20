async function handleGetHTML(sendResponse: (response: any) => void) {
	const html = document.documentElement.outerHTML;
	sendResponse({ html });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'getHTML') {
		handleGetHTML(sendResponse);
		// const html = document.documentElement.outerHTML;
		// sendResponse({ html });
	}

	return true;
});
