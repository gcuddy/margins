<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";

	let className = "";
	export { className as class };
	interface $$Props extends HTMLBaseAttributes {
		class?: string;
	}
</script>

<span
	class={cn("ml-auto text-xs tracking-widest text-gray-500", className)}
	{...$$restProps}
>
	<slot /></span
>
