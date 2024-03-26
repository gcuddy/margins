<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";
	let className: string | undefined | null = "";
	export { className as class };
	interface $$Props extends HTMLBaseAttributes {}
	export let as: string = "span";
</script>

<svelte:element
	this={as}
	class={cn("text-sm text-muted-foreground", className)}
>
	<slot />
</svelte:element>
