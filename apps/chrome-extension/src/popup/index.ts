import '../app.css';

// @ts-expect-error - svelte ts not setup yet
import Extension from '../components/extension.svelte';

const target = document.getElementById('app');

async function render() {
	const { count } = await chrome.storage.sync.get({ count: 0 });

	new Extension({ props: { count }, target });
}

document.addEventListener('DOMContentLoaded', render);
