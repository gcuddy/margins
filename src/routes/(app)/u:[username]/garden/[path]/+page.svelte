<script lang="ts">
	import { page } from "$app/stores";
	import { get } from "idb-keyval";
	import { onMount } from "svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
	console.log(data.directory);
	data.directory?.values();
	//   data.directory?.resolve()

	async function verifyPermission(fileHandle, readWrite) {
		const options = {};
		if (readWrite) {
			options.mode = "readwrite";
		}
		// Check if permission was already granted. If so, return true.
		if ((await fileHandle.queryPermission(options)) === "granted") {
			return true;
		}
		// Request permission. If the user grants permission, return true.
		if ((await fileHandle.requestPermission(options)) === "granted") {
			return true;
		}
		// The user didn't grant permission, so return false.
		return false;
	}
	let contents = "";
	$: contents = data.contents;
	async function getFile() {
		const directoryHandle = (await get("directory")) || (await window.showDirectoryPicker());
		await verifyPermission(directoryHandle, false);
		if (!directoryHandle) return;
		const fileHandle = await directoryHandle.getFileHandle($page.params.path);
		console.log(fileHandle);
		const file = await fileHandle.getFile();
		console.log(file);
		contents = await file.text();
		console.log(contents);
	}

	onMount(async () => {
		if (!data.contents) {
			await getFile();
		}
	});
</script>

<!-- <button on:click={getFile}>get</button> -->

<div class="prose select-text">
    {@html data.html}
	<!-- {#await getHTML(contents)}
		<p>loading...</p>
	{:then html}
		{@html html}
	{/await} -->
	<!-- {@html contents} -->
</div>
