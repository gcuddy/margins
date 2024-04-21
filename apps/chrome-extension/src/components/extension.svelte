<script lang="ts">
	import App from './app.svelte';
	import '@margins/ui/styles/style.css';
	import { Button } from '@margins/ui';
	import { onMount } from 'svelte';
	import { chromeStorageKeys } from '../constants';
	import QueryProvider from './query-provider.svelte';
	import RpcProvider from './rpc-provider.svelte';
	export let sessionID = '';
	export let userID = '';
	const DEV = true;
	const loginURL = DEV
		? 'http://localhost:5173/login-chrome'
		: 'https://margins.gg/login-chrome';
	onMount(() => {
		// TODO: on change of these
		chrome.storage.sync
			.get([chromeStorageKeys.sessionID, chromeStorageKeys.userID])
			.then((key) => {
				const value = key[chromeStorageKeys.sessionID];
				sessionID = value;
				const value2 = key[chromeStorageKeys.userID];
				userID = value2;
			});
	});

	async function handleSignIn() {
		await chrome.runtime.sendMessage({
			action: 'signIn',
			payload: { url: loginURL },
		});
	}
</script>

<QueryProvider>
	<div class="flex min-w-[20rem] flex-col gap-4 bg-blue-50 p-4">
		{#if sessionID && userID}
			<RpcProvider {userID} {sessionID}>
				<App {userID} {sessionID} />
			</RpcProvider>
		{:else}
			<Button on:click={handleSignIn}>Log in to Margins</Button>
		{/if}
	</div>
</QueryProvider>
