<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLAttributes } from "svelte/elements";
	let className: string | undefined | null = "";
	export { className as class };
	export let as = 'div';
	// interface $$Props extends HTMLAttributes<HTMLDivElement> {
	// 	class?: string;
	// }
</script>

<svelte:element this={as} class={cn("p-6 pt-0", className)} {...$$restProps}>
	<slot />
</svelte:element>
