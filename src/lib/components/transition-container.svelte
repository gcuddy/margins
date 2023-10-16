<script lang="ts">
	import { cn } from "$lib/utils";

	let className: string | null | undefined = undefined;
	export { className as class };
</script>

<div class={cn("grid", className)}>
	<slot />
</div>

<style>
	.grid {
		display: grid;
		grid-template-rows: 1fr;
		grid-template-columns: 1fr;
	}

	.grid :global(> *) {
		grid-row: 1;
		grid-column: 1;
	}
</style>
