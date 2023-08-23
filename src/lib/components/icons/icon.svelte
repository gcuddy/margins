<script lang='ts'>
    import { Button } from '$components/ui/button'
	import type { Builder } from 'bits-ui';
    import { icons } from "./icons";
	import { cn } from '$lib/utils';

    let builders: Builder[] = [];
</script>

<Button variant="outline" {builders} class={cn('h-12 w-12', className)}>
    <svelte:component
        this={icons.find((icon) => icon.name === activeIcon)?.component}
        data-color-hex={activeColor}
        class="h-8 w-8 shrink-0 opacity-75 text-[--color]"
        style="--color:{activeColor}"
    />
    <span class="sr-only">Icon Picker</span>
</Button>
