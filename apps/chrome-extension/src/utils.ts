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

export function getHighestZindex() {
	const zIndexes = [];

	for (const element of Array.from(document.querySelectorAll('*'))) {
		const zIndex = window
			.getComputedStyle(element, null)
			.getPropertyValue('z-index');

		if (zIndex !== null && zIndex !== 'auto') {
			zIndexes.push(Number(zIndex));
		}
	}

	if (zIndexes.length === 0) {
		return 0;
	}

	return Math.max(...zIndexes);
}
