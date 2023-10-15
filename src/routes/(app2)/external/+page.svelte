<script lang="ts">
	import { set } from 'idb-keyval';
	import { derived, writable } from 'svelte/store';

    import { browser } from '$app/environment';
	import Input from '$components/ui/input/input.svelte';
	import { localFileNames } from '$lib/features/garden/store';
	import { page } from '$app/stores';


	const filterValue = writable('');

	const filteredFiles = derived([localFileNames, filterValue], ([$localFileNames, $filterValue]) => {
		if (!$filterValue) {
			return $localFileNames;
		}
		return $localFileNames.filter((name) => name.toLowerCase().includes($filterValue.toLowerCase()));
	});

	async function iterateThroughDirectory(
		// eslint-disable-next-line no-undef
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

<Input bind:value={$filterValue} />
{#if !$localFileNames.length}
    <button on:click={getDirectory}>Link a local folder:</button>
{/if}
<ul>
	{#each $filteredFiles as item}
		<li><a href="{$page.url.pathname}/{item}">{item}</a></li>
	{/each}
</ul>
