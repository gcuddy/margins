<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";
	let className: string | undefined | null = "";
	export { className as class };
	interface $$Props extends HTMLBaseAttributes {}
</script>

<div
	class={cn("text-lg font-semibold text-gray-900 dark:text-gray-50", className)}
>
	<slot />
</div>
