<script lang="ts">
	import { clickOutside } from '$lib/actions/clickOutside';

	import focusTrap from '$lib/actions/focusTrap';
	import scrollLock from '$lib/actions/scrollLock';
	import { Keys } from '$lib/types/keyboard';
	import { createEventDispatcher, onMount, setContext } from 'svelte';
	import { readable } from 'svelte/store';
	import type { TransitionConfig } from 'svelte/transition';
	export let open = true;
	export let ariaLabeledBy: string | undefined = undefined;
	export let ariaLabel: string | undefined = undefined;
	export let ariaDescribedBy: string | undefined = undefined;

	// hmmmm
	export let onClose: (() => void) | undefined = () => (open = false);

	const state = readable({
		open,
		close: onClose,
	});
	setContext('dialog_state', state);
	let className = '';
	export { className as class };
	const dispatch = createEventDispatcher();
	let dialog: HTMLElement;

	/* Transition Stuff */

	//TODO: type it so that transitionparams succesfully gets config for function passed in
	function animate<T>(node: HTMLElement, config: T): TransitionConfig {
		return {
			duration: 0,
		};
	}

	let inProp: typeof animate = animate;
	export { inProp as in };
	export let inParams: Parameters<typeof inProp>[1] | undefined = undefined;
	export let out: typeof animate = animate;
	export let outParams: Parameters<typeof out>[1] | undefined = undefined;
</script>

<!-- <svelte:window
	on:keydown={(event) => {
		console.log({ event });
		if (event.defaultPrevented) return;
		if (event.key !== Keys.Escape) return;
		if (!open) return;
		console.log('escape key');
		event.preventDefault();
		event.stopPropagation();
		// hm
		dispatch('close');
		if (onClose) onClose();
	}}
	style="overflow: hidden;"
/> -->

{#if open}
	<!-- 		in:inProp={inParams}
		out:out={outParams}
 -->
	<!-- scrollLock is causing problems; temporarily turningn it off -->
	<div
		bind:this={dialog}
		role="dialog"
		aria-modal={open ? true : undefined}
		aria-labelledby={ariaLabeledBy}
		aria-label={!ariaLabeledBy ? ariaLabel : undefined}
		aria-describedby={ariaDescribedBy}
		class={className}
		use:focusTrap
		use:scrollLock
		use:clickOutside={{
			cb: () => dispatch('close'),
			useOnChildrenInstead: true,
		}}
	>
		<slot />
	</div>
{/if}
