<script lang="ts">
	export let checked = false;
	export let disabled = false;
	import type { HTMLButtonAttributes } from "svelte/elements";
	import { cn } from "$lib/utils/tailwind";
	let className: string | undefined | null = "";
	export { className as class };
	interface $$Props extends HTMLButtonAttributes {
		checked?: boolean;
		disabled?: boolean;
	}
</script>

<!-- "peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-gray-900 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900 dark:data-[state=unchecked]:bg-gray-700 dark:data-[state=checked]:bg-gray-400", -->
<button
	class={cn(
		"peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
		className
	)}
	{...$$restProps}
	disabled={disabled || undefined}
	data-state={checked ? "checked" : "unchecked"}
	data-disabled={disabled || undefined}
	on:keydown={(event) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			checked = !checked;
		}
	}}
	on:click={() => {
		checked = !checked;
	}}
	role="switch"
	aria-checked={checked}
>
	<span
		data-state={checked ? "checked" : "unchecked"}
		class={cn(
		        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
			)}
	/>
	<!-- "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-5" -->
</button>
