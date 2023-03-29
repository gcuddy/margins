<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";
	let className: string | undefined | null = "";
	export { className as class };
	interface $$Props extends HTMLBaseAttributes {}
</script>

<blockquote
	class={cn(
		"mt-6 border-l-2 border-gray-300 pl-6 italic text-gray-800 dark:border-gray-600 dark:text-gray-200",
		className
	)}
>
	<slot />
</blockquote>
