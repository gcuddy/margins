<script lang="ts">
	import {
		type SlimEntry,
		formatEntryPublished,
		make_link,
		getId,
	} from '$lib/utils/entries';

	export let entry: SlimEntry;

	export let link = false;
    export let viewTransition = false;
</script>

<div class="flex gap-4 grow">
	{#if entry.image}
		<img
            style:view-transition-name={viewTransition ? `artwork-${getId(entry)}` : undefined}
			src={entry.image}
			alt=""
			class=" w-16 aspect-auto rounded-sm shadow-lg"
		/>
	{/if}
	<div class="flex gap-1 flex-col">
		<span class="text-xs text-muted-foreground">
			{entry.type}
		</span>
		<div class="flex gap-1 items-center">
			<svelte:element
				this={link ? 'a' : 'span'}
				href={link ? make_link(entry) : undefined}
				class="text-base font-semibold leading-none tracking-tight"
				>{entry.title}</svelte:element
			>
            {#if entry.published}
                <span class="text-sm text-muted-foreground"
                    >{formatEntryPublished(entry)}</span
                >
            {/if}
		</div>
	</div>
</div>
