<script lang="ts">
	import { Button } from '@margins/ui';
	let trackMouseMove = false;

	async function handleClick() {
		const tab = await chrome.tabs.query({
			active: true,
			currentWindow: true,
		});
		const tabId = tab[0].id;
		if (!tabId) return;
		chrome.tabs.sendMessage(tabId, { action: 'showInspector' });
		window.close();
	}
</script>

<Button on:click={handleClick}>inspect</Button>
