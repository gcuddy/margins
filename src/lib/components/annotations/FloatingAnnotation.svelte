<script lang="ts">
	import AnnotationInput from "./AnnotationInput.svelte";
	import { portal } from "svelte-portal/src/Portal.svelte";
	import { fly, fade } from "svelte/transition";
	import { ComponentProps, createEventDispatcher, onMount } from "svelte";
	import { Focus, focusIn } from "$lib/utils/focus-management";
	import { onDestroy } from "svelte";
	export let value: string | JSONContent = "";
	export let el: HTMLElement | undefined = undefined;
	import { draggable } from "@neodrag/svelte";
	import { spring } from "svelte/motion";
	import type { Tag } from "@prisma/client";
	import RichAnnotationInput from "./RichAnnotationInput.svelte";
	import type { JSONContent } from "@tiptap/core";
	import { fadeScale } from "$lib/transitions";
	import { backInOut } from "svelte/easing";
	const dispatch = createEventDispatcher<{
		save: {
			value: string | JSONContent;
			tags: {
				id?: number;
				name: string;
			}[];
		};
		cancel: void;
	}>();
	export let allTags: Tag[] = [];
	if (!allTags.length) {
		// fetch them
	}
	export let tags: { id?: number; name: string }[] = [];

	export let rich = false;

	let saving = false;

	// This is getting an error because we have two annotationinput componentsin the same file
	// @ts-expect-error
	interface $$Props extends ComponentProps<AnnotationInput> {
		tags?: { id?: number; name: string }[];
		value: string | JSONContent;
		el?: HTMLElement;
		rich?: boolean;
		saving?: boolean;
	}

	$: console.log({ tags, $$props });
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
			el.closest("prose")?.clientWidth ||
				600 - (container ? container.offsetWidth : 280)
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
		if (container) {
			if (!rich) focusIn(container, Focus.First);
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
		if (e.movementX > 2) {
			rotation.set(2, { soft: true });
		} else if (e.movementX < -2) {
			rotation.set(-2, { soft: true });
		}
	}}
	in:fly={{ y: 10 }}
	out:fadeScale={{
		easing: saving ? backInOut : undefined,
		duration: 400,
		baseScale: 0.9,
	}}
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
	<div
		style:--scale={$scale}
		class="annotatation-container !cursor-grab shadow-xl transition-opacity"
	>
		{#if rich}
			<RichAnnotationInput
				class="w-[min(95vw,25rem)]"
				autofocus
				bind:tags
				config={{
					content: value,
				}}
				on:cancel
				on:save={(e) => {
					saving = true;
					dispatch("save", {
						value: e.detail.value,
						// TODO
						tags,
					});
				}}
			/>
		{:else}
			<AnnotationInput
				rows={2}
				include_tags={false}
				--min-width="300px"
				bind:tags
				bind:el={container}
				bind:value
				on:save={(e) => {
					saving = true;
					dispatch("save", {
						value: e.detail.value,
						// TODO
						tags,
					});
				}}
				on:cancel
				{...$$restProps}
			/>
		{/if}
	</div>
</div>

<style>
	:global(.neodrag-dragging) div {
		opacity: 0.95;
		cursor: grabbing !important;
		box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
	}
	:global(.neodrag-dragging) textarea {
		cursor: grabbing !important;
	}

	/* .annotation-container :global(:scope > div) {
		transform: scale(var(--scale)) rotate(var(--rotation)) !important;
	} */
</style>
