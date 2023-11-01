<script lang="ts">
	import type { HTMLBaseAttributes } from "svelte/elements";

	import { cn } from "$lib/utils/tailwind";
    let className = '';
    export { className as class};
    export let modifier: 'command' | 'control' | 'option' | 'shift' | 'super' | undefined = undefined;
    type $$Props = {
        class?: string;
    } & HTMLBaseAttributes

    const modifier_lookup = {
        'command': '⌘',
        'control': '⌃',
        'option': '⌥',
        'shift': '⇧',
        'super': '⌘'
    }

</script>

<kbd
	class={cn(
        "ml-auto bg-secondary text-xs tracking-widest text-secondary-foreground/75 shadow-sm px-1 rounded h-5 w-5 capitalize flex items-center justify-center",
        className
    )}
>
{#if modifier}
	<span class="text-xs">⌘</span>{/if}<slot />
</kbd>
