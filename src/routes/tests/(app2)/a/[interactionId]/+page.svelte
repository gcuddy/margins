<script lang="ts">
	import SlimEntry from '$components/entries/slim-entry.svelte';
	import { Button } from '$components/ui/button';
	import Stars from '$components/ui/star-rating/stars.svelte';
	import { formatDate } from '$lib/utils/date';
	import { getConsumedLanguage, getRevisitLanguage } from '$lib/utils/entries';
	import { Pencil1 } from 'radix-icons-svelte';

	export let data;
</script>

{#if data.interaction.entry}
	<SlimEntry link entry={data.interaction.entry} />
{/if}
<div class="flex flex-col gap-1">
	{#if data.interaction.finished}
		<span class="text-sm text-muted-foreground">
			{data.interaction.revisit
				? getRevisitLanguage(data.interaction.entry?.type, true).toLowerCase()
				: getConsumedLanguage(data.interaction.entry?.type, true).toLowerCase()}
			by
			{data.interaction.username}

			{formatDate(data.interaction.finished, {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})}
		</span>
	{/if}
	{#if data.interaction.rating}
		<Stars rating={data.interaction.rating} />
	{/if}
</div>
<div class="prose">
	{data.interaction.note}
</div>
<div class="flex justify-end">
	<Button variant="ghost" href="/tests/a/{data.interaction.id}/edit"
		><Pencil1 class="mr-2" />Edit</Button
	>
</div>
