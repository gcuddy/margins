<script lang="ts">
	import { browser } from '$app/environment';
	import ReplicacheProvider from '$lib/client/replicache-provider.svelte';
	import { AppShell } from '@margins/features/shell/index';
	export let data;
</script>

<!-- TODO: essentially we're turning this into a spa, which might not be desirable... -->
{#if browser}
	<ReplicacheProvider workspaceID={data.user.username} token={data.session?.id}>
		<AppShell>
			<slot />
		</AppShell>
	</ReplicacheProvider>
{/if}
