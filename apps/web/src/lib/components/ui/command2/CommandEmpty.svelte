<script lang="ts">
	import { cn } from '$lib/utils';
	import { ctx } from './ctx';
	import type { DivProps } from './types';

	const {
		state: { filtered, inputValue },
	} = ctx.get();

	$: render = $inputValue && $filtered.count === 0;

	type $$Props = DivProps & { show?: boolean};

    export let show = false;

	let className: $$Props['class'] = undefined;
	export { className as class };
	export let unstyled = false;
</script>

{#if show || render}
	<div
		data-command-empty
		role="presentation"
		class={cn(!unstyled && 'py-6 text-center text-sm', className)}
	>
		<slot />
	</div>
{/if}
