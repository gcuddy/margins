<script lang="ts">
	import type { HTMLLabelAttributes } from "svelte/elements";

	import { cn } from "$lib/utils/tailwind";
	let className: string | undefined | null = "";
	export { className as class };
	interface $$Props extends HTMLLabelAttributes {}
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label
	{...$$restProps}
	class={cn(
		"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
		className
	)}
	on:mousedown
	on:mousedown={(e) => {
		// prevent text selection when double clicking label
		if (!e.defaultPrevented && e.detail > 1) e.preventDefault();
	}}
>
	<slot />
</label>
