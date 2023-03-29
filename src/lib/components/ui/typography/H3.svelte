<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";
	let className: string | undefined | null = "";
	export { className as class };
	interface $$Props extends HTMLBaseAttributes {}
</script>

<h3
	class={cn(
		"mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
		className
	)}
>
	<slot />
</h3>
