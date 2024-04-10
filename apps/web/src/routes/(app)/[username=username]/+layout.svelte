<script lang="ts">
	import { browser } from '$app/environment';
	import CommandMenu from '$lib/client/command-menu.svelte';
	import ReplicacheProvider from '$lib/client/replicache-provider.svelte';
	import { AppShell } from '@margins/features/shell';
	export let data;
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
