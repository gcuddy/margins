<script lang="ts">
	import { browser } from '$app/environment';
	import CommandMenu from '$lib/client/command-menu.svelte';
	import ReplicacheProvider from '$lib/client/replicache-provider.svelte';
	import { AppShell } from '@margins/features/shell';
	import PartySocket from 'partysocket';
	import { onDestroy, onMount } from 'svelte';
	export let data;

	let conn: PartySocket | null = null;

	onMount(() => {
		conn = new PartySocket({
			host: 'http://127.0.0.1:1999',
			room: data.user.id,
		});
		conn.addEventListener('message', (event) => {
			// console.log('message', event.data);
		});
	});

	onDestroy(() => {
		conn?.close();
	});
</script>

<!-- TODO: essentially we're turning this into a spa, which might not be desirable... -->
{#if browser}
	<ReplicacheProvider workspaceID={data.user.username} token={data.session?.id}>
		<CommandMenu />
		<AppShell>
			<slot />
		</AppShell>
	</ReplicacheProvider>
{/if}
