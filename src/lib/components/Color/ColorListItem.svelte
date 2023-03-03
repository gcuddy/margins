<script lang="ts">
	import type { Color } from "@prisma/client";
	export let color: {
		name?: string;
		id: Color;
	};
	export let active = false;
	export let multiple = false;
	export let selected = false;

	$: background = `var(--highlight-${color.id.toLowerCase()})`;
</script>

<div class="flex h-8 items-center gap-2 px-2 text-sm">
	{#if multiple}
		<input type="checkbox" name="" id="" checked={selected} />
	{/if}
	<div style:background class="h-4 w-4 rounded-full" />
	<span class="grow {active ? 'dark:text-gray-100' : 'text-gray-700 dark:text-gray-100'}"
		>{color.name || color.id}</span
	>
</div>
