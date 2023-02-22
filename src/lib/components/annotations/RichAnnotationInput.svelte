<script lang="ts">
	import type { Annotation, Tag } from "@prisma/client";
	import type { EditorOptions, JSONContent } from "@tiptap/core";

	import { ComponentProps, createEventDispatcher, onMount } from "svelte";
	import Button from "../Button.svelte";
	import Icon from "../helpers/Icon.svelte";
	import TipTap from "../TipTap.svelte";
	export let el: HTMLElement | undefined = undefined;
	export let textarea: HTMLElement | undefined = undefined;
	export let include_tags = true;
	export let scrollIntoView = true;
	export let confirmButtonStyle: "ghost" | "confirm" = "confirm";
	export let shadow_focus = false;
	export let placeholder = "Add an annotation…";
	export let annotation: Annotation | undefined = undefined;
    export let config: Partial<EditorOptions> = {};
    // interface $$Props extends ComponentProps<TipTap> {
    //     el?: HTMLElement;
    //     textarea?: HTMLElement;
    //     include_tags?: boolean;
    //     scrollIntoView?: boolean;
    //     confirmButtonStyle?: "ghost" | "confirm";
    //     shadow_focus?: boolean;
    //     placeholder?: string;
    //     annotation?: Annotation;
    //     focused?: boolean;
    //     saving?: boolean;
    //     expandButton?: boolean;
    // }
	const dispatch = createEventDispatcher<{
		save: {
			value: JSONContent;
			// done: typeof doneSaving;
		};
		cancel: void;
		expand: JSONContent;
	}>();
	export let focused = false;

    export let autofocus = false;
	let className = "";
	export { className as class };
	onMount(() => {
		textarea?.focus();
		if (scrollIntoView) {
			textarea?.scrollIntoView({
				block: "nearest",
			});
		}
	});

	export let saving = false;
	const doneSaving = () => (saving = false);
	export let expandButton = false;
	let contentData: JSONContent;
</script>

<!-- TODO: TURN INTO FORM -->

<!-- transparency is a bit much (and maybe causes gpu performance issues), but here were the classes: dark:transparency:bg-gray-800/50 dark:transparency:backdrop-blur-xl dark:transparency:backdrop-brightness-75 dark:transparency:backdrop-contrast-75 dark:transparency:backdrop-saturate-200 -->
<div
	bind:this={el}
	class="annotation-input not-prose group relative z-50 flex resize scroll-mt-12 flex-col items-start gap-2.5 rounded-lg border border-gray-200 bg-elevation p-2.5 font-sans   transition-shadow  transparency:backdrop-blur-xl transparency:backdrop-brightness-125 transparency:backdrop-saturate-200 dark:border-0 dark:ring-1  dark:ring-gray-400/10 focus-within:dark:ring-gray-400/20  transparency:dark:bg-gray-800 {className} {shadow_focus &&
	focused
		? 'shadow-lg'
		: shadow_focus
		? 'shadow'
		: ''}"
>
	{#if expandButton}
		<div class="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
			<Button variant="naked" size="sm" on:click={() => dispatch("expand", contentData)}>
				<Icon name="arrowsPointingOutMini" className="h-4 w-4 fill-muted" />
			</Button>
		</div>
	{/if}

	<div class="resizer absolute bottom-0 right-0">
		<!-- <Icon name="" /> -->
		<!-- TODO: 8 direction resize -->
	</div>
	<!-- todo: auto expand -->
	<div class="no-drag w-full cursor-default">
		<TipTap
            {autofocus}
			bind:editing={focused}
			focusRing={false}
			on:update={(e) => {
				console.log({ e });
				contentData = e.detail;
			}}
			{placeholder}
			class="!max-w-none"
			config={{
				content: annotation?.contentData || "",
                ...config
			}}
		/>
		{#if include_tags}
			<div class="flex grow items-center font-normal">
				<!-- <TagEntry {size} bind:tags className="grow text-xs not-italic" {allTags} /> -->
			</div>
		{/if}
	</div>
	<slot name="bottom" {contentData}>
		<div class="flex flex-row items-center justify-end space-x-2 self-stretch">
			<slot name="buttons">
				<!-- //todo -->
				<Button variant="ghost" on:click={() => dispatch("cancel")}>Cancel</Button>
				<Button
					variant={confirmButtonStyle}
					type="submit"
					on:click={() => dispatch("save", { value: contentData })}
				>
					{#if saving}
						<Icon name="loading" className="animate-spin h-4 w-4 text-current" />
					{:else}
						Save
					{/if}
				</Button>
			</slot>
		</div>
	</slot>
</div>

<style>
	:global(.neodrag-dragging) textarea {
		cursor: grabbing !important;
	}
	.annotation-input {
		transform: scale(var(--scale));
	}
</style>
