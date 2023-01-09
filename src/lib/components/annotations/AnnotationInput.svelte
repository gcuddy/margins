<script lang="ts">
	import { page } from '$app/stores';
	import { disableGlobalKeyboardShortcuts } from '$lib/stores/keyboard';
	import { isTouchDevice } from '$lib/utils';
	import type { Tag } from '@prisma/client';

	import { createEventDispatcher, tick } from 'svelte';
	import { onMount } from 'svelte';
	import Button from '../Button.svelte';
	import GenericTextarea from '../GenericTextarea.svelte';
	import TagEntry from '../TagEntry.svelte';
	export let value = '';
	export let el: HTMLElement | undefined = undefined;
	export let textarea: HTMLElement | undefined = undefined;
	export let include_tags = true;
	export let scrollIntoView = true;
	export let confirmButtonStyle: 'ghost' | 'confirm' = 'confirm';
	export let allTags: Tag[] = [];
	export let shadow_focus = false;
	export let placeholder = 'Add an annotation…';
	export let rows = 4;
	$: console.log({ allTags });
	if (!allTags.length) {
		if ($page.data.tags) {
			allTags = $page.data.tags;
		} else {
			fetch(`/api/v1/tags.json`)
				.then((res) => res.json())
				.then((tags) => (allTags = tags));
		}
		// todo: fetch
	}
	export let tags: Tag[] = [];
	$: console.log({ tags });
	const dispatch = createEventDispatcher<{
		save: {
			value: string;
		};
		cancel: void;
	}>();
	export let focused = false;

	let className = '';
	export { className as class };
	onMount(() => {
		textarea?.focus();
		textarea?.scrollIntoView({
			block: 'center',
		});
	});
</script>

<!-- TODO: TURN INTO FORM -->

<!-- transparency is a bit much (and maybe causes gpu performance issues), but here were the classes: dark:transparency:bg-gray-800/50 dark:transparency:backdrop-blur-xl dark:transparency:backdrop-brightness-75 dark:transparency:backdrop-contrast-75 dark:transparency:backdrop-saturate-200 -->
<div
	bind:this={el}
	class="annotation-input not-prose relative z-50 flex min-w-[min(300px,100%)] max-w-md resize scroll-mt-12 flex-col items-start gap-2.5 rounded-lg border border-gray-200 bg-white p-2.5 font-sans   transition-shadow transparency:bg-gray-50/90 transparency:backdrop-blur-xl transparency:backdrop-brightness-125 transparency:backdrop-saturate-200 dark:border-0 dark:bg-gray-800 dark:ring-1  dark:ring-gray-400/10 focus-within:dark:ring-gray-400/20  transparency:dark:bg-gray-800 {className} {shadow_focus &&
	focused
		? 'shadow-lg'
		: shadow_focus
		? 'shadow'
		: ''}"
>
	<div class="resizer absolute bottom-0 right-0">
		<!-- <Icon name="" /> -->
		<!-- TODO: 8 direction resize -->
	</div>
	<!-- todo: auto expand -->
	<div class="no-drag w-full cursor-default">
		<GenericTextarea
			bind:el={textarea}
			variant="naked"
			on:keydown={(e) => {
				if (e.key === 'Escape') {
					// TODO: get this to work
					// e.preventDefault();
					// disableGlobalKeyboardShortcuts.on();
					// textarea?.blur();
					// tick().then(() => disableGlobalKeyboardShortcuts.off());
				}
				if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
					e.preventDefault();
					dispatch('save', { value });
				}
			}}
			on:focus={() => (focused = true)}
			on:blur={() => (focused = false)}
			{placeholder}
			name="annotation"
			bind:value
			{rows}
			class="w-full grow resize-none border-0 bg-transparent p-2 text-sm placeholder-gray-400 transition focus:ring-0"
		/>
		<!-- <textarea
		/> -->
		{#if include_tags}
			<div class="flex grow items-center font-normal">
				<TagEntry size="sm" bind:tags className="grow text-xs not-italic" {allTags} />
			</div>
		{/if}
	</div>
	<div class="flex flex-row items-center justify-end space-x-2 self-stretch">
		<slot name="buttons">
			<!-- //todo -->
			<Button variant="ghost" on:click={() => dispatch('cancel')}>Cancel</Button>
			<Button
				variant={confirmButtonStyle}
				type="submit"
				on:click={() =>
					dispatch('save', {
						value,
					})}>Save</Button
			>
		</slot>
	</div>
</div>

<style>
	:global(.neodrag-dragging) textarea {
		cursor: grabbing !important;
	}
	.annotation-input {
		transform: scale(var(--scale));
	}
</style>
