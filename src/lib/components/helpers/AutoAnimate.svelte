<script lang="ts">
	import type { AnimationController } from "@formkit/auto-animate";
	import autoAnimate from "@formkit/auto-animate";
	import { getContext, onDestroy, onMount } from "svelte";
	import type { Writable } from "svelte/store";
	import type { HTMLBaseAttributes } from "svelte/elements";

	// looks for disable animation store
	// todo: allow a prop as well
	let animationController: AnimationController | undefined = undefined;
	let container: HTMLElement | undefined = undefined;

	const disableAnimation: Writable<boolean> = getContext("disableAnimation");
	$: console.log({ disableAnimation });

	const unsubscribeDisableAnimation = disableAnimation
		? disableAnimation?.subscribe((active) => {
				if (active) {
					console.log("disabling animations");
					animationController?.disable();
				} else {
					console.log("enabling animation");
					animationController?.enable();
				}
		  })
		: undefined;

	onMount(() => {
		if (container) {
			animationController = autoAnimate(container);
			// disable until explicitly enabled
			animationController.disable();
		}
	});
	onDestroy(() => {
		unsubscribeDisableAnimation && unsubscribeDisableAnimation();
	});

	interface $$Props extends HTMLBaseAttributes {}
</script>

<div bind:this={container} {...$$restProps}>
	<!-- {$disableAnimation} -->
	<slot />
</div>
