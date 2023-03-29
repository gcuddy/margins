<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";
	interface $$Props extends HTMLBaseAttributes {}
</script>

<div
	class={cn("flex flex-col space-y-2 text-center sm:text-left", $$props.class)}
	{...$$restProps}
>
	<slot />
</div>
