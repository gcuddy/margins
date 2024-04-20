export async function getCurrentMetadata(
	cb: (data: { html: string; url: string }) => void,
): Promise<void> {
	return chrome.tabs.query(
		{
			active: true,
			currentWindow: true,
		},
		(tabs) => {
			const tab = tabs[0];
			if (!tab?.id || !tab.url) return;
			const url = tab.url;
			chrome.tabs.sendMessage(
				tab.id,
				{ action: 'getHTML' },
				async ({ html }: { html: string }) =>
					cb({
						html,
						url,
					}),
			);
		},
	);
}
