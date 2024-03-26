<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";
	let className: string | undefined | null = "";
	export { className as class };
	interface $$Props extends HTMLBaseAttributes {}
</script>

<h4
	class={cn("mt-8 scroll-m-20 text-xl font-semibold tracking-tight", className)}
>
	<slot />
</h4>
