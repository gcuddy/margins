<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";
	let className: string | undefined | null = "";
	export { className as class };
	interface $$Props extends HTMLBaseAttributes {}
</script>

<h2
	class={cn(
		"scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
		className
	)}
>
	<slot />
</h2>
