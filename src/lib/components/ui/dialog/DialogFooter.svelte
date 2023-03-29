<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";
	interface $$Props extends HTMLBaseAttributes {}
</script>

<div
	class={cn(
		"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
		$$props.class
	)}
	{...$$restProps}
>
	<slot />
</div>
