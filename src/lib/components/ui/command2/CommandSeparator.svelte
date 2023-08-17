<script lang="ts">
	import { cn } from '$lib/utils';
	/**
	 * A visual and semantic separator between items or groups.
	 * Visible when the search query is empty or `alwaysRender` is true, hidden otherwise.
	 */
	import { ctx } from './ctx';
	import type { DivProps } from './types';

	type $$Props = DivProps & {
		alwaysRender?: boolean;
	};

	export let alwaysRender = false;
    let className: $$Props['class'] = undefined
    export { className as class };
    export let unstyled = false;
	const {
		state: { inputValue }
	} = ctx.get();

	$: render = !$inputValue || alwaysRender;
</script>

{#if render || alwaysRender}
	<div data-command-separator role="separator" class={
        cn(
            !unstyled && "-mx-1 h-px bg-border",
            className
        )
    } {...$$restProps} />
{/if}
