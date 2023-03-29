<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLAttributes } from "svelte/elements";
	let className: string | undefined | null = "";
	export { className as class };
	interface $$Props extends HTMLAttributes<HTMLHeadingElement> {
		class?: string;
	}
</script>

<p class={cn("text-sm text-gray-600 dark:text-gray-400", className)}>
	<slot />
</p>
