<script lang="ts">
	import { cn } from "$lib/utils";
	import type { HTMLAttributes } from "svelte/elements";

	type $$Props = HTMLAttributes<HTMLTableSectionElement> & {
        el?: HTMLTableSectionElement;
    }

	let className: $$Props["class"] = undefined;
	export { className as class };
    export let el: HTMLTableSectionElement | undefined = undefined;
</script>

<tbody bind:this={el} class={cn("[&_tr:last-child]:border-0", className)} {...$$restProps}>
	<slot />
</tbody>
