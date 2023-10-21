<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLAttributes } from "svelte/elements";

	interface $$Props extends HTMLAttributes<HTMLDivElement> {
		ratio?: number;
		class?: string;
	}
	export let ratio = 1;
	let c = "";
	export { c as class };
</script>

<div
	class="relative w-full"
	style:padding-bottom="{100 / ratio}%"
	data-aspect-ratio-wrapper=""
>
	<div {...$$restProps} class={cn("absolute bottom-0 left-0 right-0 top-0", c)}>
		<slot />
	</div>
</div>
