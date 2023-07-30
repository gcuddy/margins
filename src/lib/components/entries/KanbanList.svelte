<script lang="ts">
	import type { EntryInList } from '$lib/db/selects';
	import Kanban from './Kanban.svelte';

	export let entries: EntryInList[];

	function isEntryInList(entry: unknown) {
		return entry as EntryInList;
	}
</script>

<Kanban items={entries} grouping="status" let:item>
	{@const entry = isEntryInList(item)}

	{entry.title}
</Kanban>
