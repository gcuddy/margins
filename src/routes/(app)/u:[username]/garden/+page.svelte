<script lang="ts">
	import { get, set } from 'idb-keyval';

	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { localFileNames } from '$lib/features/garden/store';
	const files = [];
	async function iterateThroughDirectory(
		directoryHandle: FileSystemDirectoryHandle,
	) {
		for await (const entry of directoryHandle.values()) {
			if (entry.kind === 'file') {
				if (entry.name.endsWith('.md')) {
					// push filename without extension
					$localFileNames = [...$localFileNames, entry.name];
				}
			} else if (entry.kind === 'directory') {
				if (entry.name === 'node_modules') {
					continue;
				}
				// console.log({entry})
				// if (entry.name.startsWith(".")) continue;
				// console.log({entry})
				// iterateThroughDirectory(entry);
			}
		}
	}

	// TODO: Sync this with idb
	export async function getDirectory() {
		$localFileNames = [];
		if (browser) {
			const directoryHandle = await window.showDirectoryPicker();
			await set('directory', directoryHandle);
			iterateThroughDirectory(directoryHandle);
		}
	}
</script>

Garden allows you to store your digital garden here. You can keep it local by
linking a local folder of markdown files. Or you can store it here.

<button on:click={getDirectory}>Link a local folder:</button>
{$localFileNames.length} files found.
{#each $localFileNames as file}
	<a href="{$page.url.pathname}/{file}">{file}</a>
{/each}
