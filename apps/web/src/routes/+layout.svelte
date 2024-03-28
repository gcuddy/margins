<script lang="ts">
	import { page } from '$app/stores';
	import '@margins/ui/styles/style.css';
	import { ModeWatcher } from 'mode-watcher';
</script>

<ModeWatcher />
<svelte:head>
	<title>
		{$page.data.title || 'Margins'}
	</title>
	{#if $page.data.description}
		<meta name="description" content={$page.data.description} />
	{/if}
</svelte:head>
<slot />
