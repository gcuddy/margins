<script lang="ts">
	import Header from '$components/ui/Header.svelte';
	import { ChevronRight } from 'radix-icons-svelte';
	import { make_link } from '$lib/utils/entries';

    export let data;
    $: entryLink = data.interaction.entry ? make_link(data.interaction.entry) : undefined;

</script>

<svelte:head>
	<title>
		{data.interaction.entry?.title} - {data.interaction.username}
	</title>
</svelte:head>
<Header>
	<div class="flex items-center gap-1 text-sm">
		{#if data.interaction.entry}
			<a href={entryLink} class="text-muted-foreground">
				{data.interaction.entry?.title}
			</a>
			<ChevronRight />
		{/if}
		<svelte:element
			this={entryLink ? 'a' : 'span'}
			href={entryLink ? `${entryLink}/activity` : undefined}
			>Activity</svelte:element
		>
	</div>
</Header>

<div class="flex items-center justify-center">
	<div class="space-y-8 flex flex-col max-w-prose grow p-6 shrink-0">
		<slot />
	</div>
</div>
