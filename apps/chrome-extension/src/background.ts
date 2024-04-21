import { getCurrentMetadata } from './utils';
import { chromeStorageKeys } from './constants';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log('background.ts: chrome.runtime.onMessage.addListener');
	switch (request.action) {
		case 'signIn': {
			// remove any old listener if exists
			chrome.tabs.onUpdated.removeListener(setTokens);
			const url = request.payload.url;
			chrome.tabs.create({ active: true, url }, (_tab) => {
				// add listener to that url and watch for access_token and refresh_token query string params
				chrome.tabs.onUpdated.addListener(setTokens);
				sendResponse(request.action + ' executed');
			});
			break;
		}
		case 'getMetadata': {
			getCurrentMetadata(sendResponse);
			break;
		}
		case 'hello': {
			console.log('hello from content script');
			sendResponse('hello from background');
			break;
		}
		case 'fetchData': {
			fetch(request.payload.url, request.payload.options)
				.then((response) => response.json()) // assuming the server response is JSON
				.then((data) => sendResponse(data))
				.catch((error) => sendResponse({ error: error.toString() }));
			break;
		}
		default: {
			break;
		}
	}

	return true;
});

const setTokens = async (
	tabId: number,
	_changeInfo: chrome.tabs.TabChangeInfo,
	tab: chrome.tabs.Tab,
) => {
	// once the tab is loaded
	if (tab.status === 'complete') {
		if (!tab.url) return;
		const url = new URL(tab.url);
		console.log({ url });

		// at this point user is logged-in to the web app
		// url should look like this: https://my.webapp.com/#access_token=zI1NiIsInR5c&expires_in=3600&provider_token=ya29.a0AVelGEwL6L&refresh_token=GEBzW2vz0q0s2pww&token_type=bearer
		// parse access_token and refresh_token from query string params
		if (url.origin === 'http://localhost:5173') {
			console.log('got it');
			const params = new URL(url.href).searchParams;
			const accessToken = params.get('sessionToken');
			const userID = params.get('userID');
			console.log({ accessToken });

			if (accessToken) {
				if (!tab.id) return;

				// we can close that tab now
				await chrome.tabs.remove(tabId);

				// store session_id
				await chrome.storage.sync.set({
					[chromeStorageKeys.userID]: userID,
					[chromeStorageKeys.sessionID]: accessToken,
				});

				// remove tab listener as tokens are set
				chrome.tabs.onUpdated.removeListener(setTokens);
			}
		}
	}
};
