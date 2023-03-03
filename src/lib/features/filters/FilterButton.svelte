<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import { useFilterContext } from "./Filters.svelte";

	const a = useFilterContext(`<FilterButton />`);
</script>

<Button on:click={filterStore.actions.new} variant="dashed" className="pl-1"
	><Icon name="plusSmSolid" />New Condition</Button
>
