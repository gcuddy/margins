<script lang="ts">
	import { useId } from '$lib/hooks/use-id';
	import { getContext } from 'svelte';
	import type { Readable } from 'svelte/store';
	import type { TransitionConfig } from 'svelte/transition';

	type TTransition = $$Generic;

	//TODO: type it so that transitionparams succesfully gets config for function passed in
	function animate<T>(node: HTMLElement, config: T): TransitionConfig {
		return {};
	}
	export let el: HTMLElement | undefined = undefined;
	export let transition = animate;
	export let transitionParams: Parameters<typeof transition>[1] | undefined = undefined;
	let inProp: typeof animate = animate;
	export { inProp as in };
	export let inParams: Parameters<typeof inProp>[1] | undefined = undefined;
	export let out: typeof animate = animate;
	export let outParams: Parameters<typeof out>[1] | undefined = undefined;
	// export let fadeParams: FadeParams = {
	// 	duration: 0
	// };
	let className = '';
	export { className as class };

	export let id = 'dialog-overlay-' + useId();

	const state: Readable<{
		open: boolean;
		close: (() => void) | undefined;
	}> = getContext('dialog_state');

	function handleClick(e: MouseEvent) {
		if (e.target !== e.currentTarget) return;
		e.preventDefault();
		e.stopPropagation();
		if ($state.close) {
			console.log('clicked overlay, closing');
			$state.close();
		}
	}
</script>

<!-- in:inProp={inParams}
out:out={inParams} -->
<div
	class={className}
	on:click={handleClick}
	aria-hidden="true"
	transition:transition={transitionParams}
	on:introstart
	on:outrostart
	on:introend
	on:outroend
	bind:this={el}
/>
