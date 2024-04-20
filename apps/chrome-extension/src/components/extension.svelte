<script lang="ts">
	import App from './app.svelte';
	import '@margins/ui/styles/style.css';
	import { Button } from '@margins/ui';
	import { onMount } from 'svelte';
	import { chromeStorageKeys } from '../constants';
	export let sessionID = '';
	const DEV = true;
	const loginURL = DEV
		? 'http://localhost:5173/login-chrome'
		: 'https://margins.gg/login-chrome';
	onMount(() => {
		chrome.storage.sync.get(chromeStorageKeys.sessionID).then((key) => {
			const value = key[chromeStorageKeys.sessionID];
			sessionID = value;
		});
	});
</script>

<div class=" flex min-w-[20rem] flex-col gap-4 bg-blue-50 p-4">
	{#if sessionID}
		<App {sessionID} />
	{:else}
		<Button
			on:click={async () => {
				await chrome.runtime.sendMessage({
					action: 'signIn',
					payload: { url: loginURL },
				});
			}}>Log in to Margins</Button
		>
	{/if}
</div>
