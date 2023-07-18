<script lang="ts">
	import EntryIcon from '$components/entries/EntryIcon.svelte';
	import Badge from '$components/ui/Badge.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: attachments =
		data.entry?.back_relations?.filter((r) => r.type === 'Grouped' && r.related_entry) || [];
</script>

{#each attachments as { related_entry: entry }}
	{#if entry}
		<Badge as="a" href='/tests/pdf/{entry.id}' variant="secondary" class="rounded py-7 px-6 font-normal flex text-base gap-x-4">
			<EntryIcon type={entry?.type} />
			{entry?.title}
		</Badge>
	{/if}
{/each}
