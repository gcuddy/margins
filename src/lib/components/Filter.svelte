<script lang="ts">
	import { derived, writable } from 'svelte/store';

	type T = $$Generic;
	export let query = writable('');
	export let values: T[];
	export let filterBy: (value: T, query: string) => boolean;

	const filteredActions = derived(query, (query) => {
		return values.filter(() => {
			return filterBy(values, query);
		});
	});
</script>

<input type="text" name="" id="" bind:value={$query} />
