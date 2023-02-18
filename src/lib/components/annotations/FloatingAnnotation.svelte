<script lang="ts">
	import AnnotationInput from "./AnnotationInput.svelte";
	import { portal } from "svelte-portal/src/Portal.svelte";
	import { fly, fade } from "svelte/transition";
	import { ComponentProps, createEventDispatcher, onMount } from "svelte";
	import { Focus, focusIn } from "$lib/utils/focus-management";
	import { onDestroy } from "svelte";
	export let value = "";
	export let el: HTMLElement | undefined = undefined;
	import { draggable } from "@neodrag/svelte";
	import { spring } from "svelte/motion";
	import type { Tag } from "@prisma/client";
	const dispatch = createEventDispatcher();
	export let allTags: Tag[] = [];
	if (!allTags.length) {
		// fetch them
	}
	export let tags: Tag[] = [];

	interface $$Props extends ComponentProps<AnnotationInput> {
		tags?: Tag[];
		value?: string;
		el?: HTMLElement;
	}

	$: console.log({ tags });
	let dragging = false;
	let container: HTMLElement | undefined;

	let initialRect = el.getBoundingClientRect();
	let rotation = spring(-1, {
		damping: 0.1,
		stiffness: 0.1,
		precision: 0.2,
	});
	let x: number = Math.max(
		Math.min(
			initialRect.x - (container ? container.offsetWidth : 280) * 1.5,
			el.closest("prose")?.clientWidth || 600 - (container ? container.offsetWidth : 280)
		),
		0
	);
	let y: number =
		window.innerHeight > initialRect.y + (container?.offsetHeight + 10 || 170)
			? 0
			: -1 * (container?.offsetHeight || 175);

	$: console.log({ initialRect });
	$: console.log({ x, y });

	let scale = spring(1);
	$: if (dragging) {
		scale.set(1.1, { soft: true });
	} else {
		scale.set(1);
	}

	$: console.log({ el });
	// export let container: HTMLElement;
	// $: top = rect.top + container.scrollTop;
	// $: left = rect.left + rect.width / 2 - container.offsetLeft;
	function calculateLeftOrRight(): "left" | "right" | "center" | void {
		if (!container) return;
		console.log("calculating pos");
		const { left, right, width } = el.getBoundingClientRect();
		console.log({
			left,
			right,
			width,
			clientWidth: document.body.clientWidth,
			innerWidth: window.innerWidth,
			containerWidth: container.offsetWidth,
		});
		console.log(document.body.clientWidth - right < container.offsetWidth + 10);
		if (document.body.clientWidth - (container.offsetWidth + width) < 0) {
			return "center";
		}
		if (right - container.offsetWidth > 0) {
			return "right";
		} else if (left + container.offsetWidth < document.body.clientWidth) {
			return "left";
		} else {
			return "center";
		}
	}

	const setPos = () => {
		if (container) {
			requestAnimationFrame(() => (pos = calculateLeftOrRight()));
		}
	};

	$: pos = calculateLeftOrRight();
	onMount(() => {
		focusIn(container, Focus.First);
		if (container) {
			pos = calculateLeftOrRight();
		}
		document.addEventListener("resize", setPos);
	});
	onDestroy(() => {
		document.removeEventListener("resize", setPos);
	});
</script>

<!-- {pos === 'left'
		? 'left-0'
		: pos === 'right'
		? 'right-0'
		: ''} -->
<div
	use:portal={el}
	on:mousemove={(e) => {
		console.log({ e });
		if (e.movementX > 2) {
			rotation.set(2, { soft: true });
		} else if (e.movementX < -2) {
			rotation.set(-2, { soft: true });
		}
	}}
	in:fly={{ y: 10 }}
	out:fade
	class="floating-annotation absolute z-20 resize"
	use:draggable={{
		position: { x, y },
		cancel: "textarea, span, button, .resizer, .no-drag",
		bounds: "main [data-content-container]",
	}}
	on:keydown={(e) => {
		if (e.key === "Escape") {
			dispatch("cancel");
		}
	}}
	on:neodrag={() => {
		dragging = true;
	}}
	on:neodrag:end={(e) => {
		rotation.set(0);
		const { offsetX, offsetY } = e.detail;
		// scale.set(1, { soft: true });
		x = offsetX;
		y = offsetY;
		dragging = false;
	}}
>
	<!-- style:--rotation="{$rotation}deg" -->
	<!--  -->
	<!-- TODO: form? -->
	<div style:--scale={$scale} class="annotatation-container !cursor-grab shadow-lg transition-opacity">
		<AnnotationInput bind:tags bind:el={container} bind:value on:save on:cancel {...$$restProps} />
	</div>
</div>

<style>
	:global(.neodrag-dragging) div {
		opacity: 0.95;
		cursor: grabbing !important;
		box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
	}
	.annotation-container :global(:scope > div) {
		transform: scale(var(--scale)) rotate(var(--rotation)) !important;
	}
</style>
