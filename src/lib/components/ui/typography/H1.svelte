<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";
	let className: string | undefined | null = "";
	export { className as class };
	interface $$Props extends HTMLBaseAttributes {}
</script>

<h1
	class={cn(
		"scroll-m-20 font-extrabold tracking-tight text-4xl lg:text-5xl",
		className
	)}
>
	<slot />
</h1>
