<script lang="ts">
	import { cn } from '$lib/utils';
	import { ctx } from './ctx';
	import type { DivProps } from './types';

	const { ids } = ctx.get();

    type $$Props = DivProps
    let className: $$Props["class"] = undefined;
    export let unstyled = false;
</script>

<div id={ids.menu} class={
    cn(
        !unstyled && "max-h-[300px] overflow-y-auto overflow-x-hidden",
        className
    )
} role="listbox">
	<slot />
</div>
