<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import { DialogTitle } from "@rgossiaux/svelte-headlessui";
	import type { HTMLBaseAttributes } from "svelte/elements";
	interface $$Props extends HTMLBaseAttributes {}
</script>

<DialogTitle
	class={cn(
		"text-lg font-semibold text-slate-900",
		"dark:text-slate-50",
		$$props.class
	)}
	{...$$restProps}><slot /></DialogTitle
>
