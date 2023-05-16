<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import { DialogTitle } from "@rgossiaux/svelte-headlessui";
	import type { HTMLBaseAttributes } from "svelte/elements";
	interface $$Props extends HTMLBaseAttributes {}
</script>

<DialogTitle
	class={cn(
		"text-lg font-semibold leading-none tracking-tight",
		$$props.class
	)}
	{...$$restProps}><slot /></DialogTitle
>
