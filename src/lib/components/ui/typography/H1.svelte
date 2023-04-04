<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";
	let className: string | undefined | null = "";
	export { className as class };
	interface $$Props extends HTMLBaseAttributes {}
</script>

<h1
	class={cn(
		"scroll-m-20 text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl",
		className
	)}
>
	<slot />
</h1>
