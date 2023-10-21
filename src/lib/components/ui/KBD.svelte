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
        "ml-auto text-xs tracking-widest border text-muted-foreground shadow-sm p-0.5 rounded min-w-[17px] capitalize align-baseline text-center",
        className
    )}
>
{#if modifier}
	<span class="text-xs">⌘</span>{/if}<slot />
</kbd>
