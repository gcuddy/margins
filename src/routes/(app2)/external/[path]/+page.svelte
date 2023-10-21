<script lang="ts">
	import { get } from 'idb-keyval';
	import { onMount } from 'svelte';

	import { page } from '$app/stores';
	import Editor from '$components/ui/editor/Editor.svelte';

	async function verifyPermission(fileHandle, readWrite) {
		const options = {};
		if (readWrite) {
			options.mode = 'readwrite';
		}
		// Check if permission was already granted. If so, return true.
		if ((await fileHandle.queryPermission(options)) === 'granted') {
			return true;
		}
		// Request permission. If the user grants permission, return true.
		if ((await fileHandle.requestPermission(options)) === 'granted') {
			return true;
		}
		// The user didn't grant permission, so return false.
		return false;
	}
	let contents = '';
	async function getFile() {
		const directoryHandle =
			(await get('directory')) || (await window.showDirectoryPicker());
		await verifyPermission(directoryHandle, false);
		if (!directoryHandle) {
			return;
		}
		const fileHandle = await directoryHandle.getFileHandle($page.params.path);
		const file = await fileHandle.getFile();
		contents = await file.text();
	}

	onMount(async () => {
		await getFile();
	});
</script>

<!-- <button on:click={getFile}>get</button> -->

<!-- <div class="prose select-text">
	{contents}
</div> -->
{#if contents}
	<Editor content={contents} />
{/if}
