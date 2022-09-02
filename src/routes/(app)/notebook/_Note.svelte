<script lang="ts">
	import type { Annotation, Highlight } from '@prisma/client';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import dayjs from 'dayjs';
	export let note: Highlight | Annotation;
	export let className = '';
	export let articleUrl: string;
	export let dragDisabled: boolean;
	import { enhance } from '$lib/actions/form';
	import { modals } from '$lib/stores/modals';
	import NoteOptionsModal from '$lib/components/modals/_NoteOptionsModal.svelte';
	function isHighlight(note: Highlight | Annotation): note is Highlight {
		return (note as Highlight).startMeta !== undefined;
	}
	let type: 'highlight' | 'annotation';
	$: type = isHighlight(note) ? 'highlight' : 'annotation';

	let pending_flag = false;
	$: endpoint = `/notebook/${type?.slice(0, 1)}-${note.id}`;
	function openOptions() {
		modals.open(NoteOptionsModal, {
			note,
			type,
			endpoint,
			articleUrl
		});
	}
</script>

<div
	class="flex min-h-max flex-col rounded-lg border-2 {type === 'highlight'
		? 'border-amber-400'
		: 'border-blue-400/50'}  bg-white shadow-sm dark:bg-black {className}"
>
	<div
		class="flex h-8 {dragDisabled
			? 'cursor-grab'
			: 'cursor-grabbing'} items-center border-b bg-zinc-100 px-3 py-1 text-xs dark:bg-zinc-900"
		on:mousedown|preventDefault={() => (dragDisabled = false)}
		on:touchstart|preventDefault={() => (dragDisabled = false)}
	>
		Note from {dayjs(note.createdAt).format('MMM D, YYYY')}
	</div>
	<div
		class="{type === 'annotation'
			? 'bg-yellow-100/25'
			: 'bg-inherit'} prose h-80 flex-auto shrink-0 resize-y overflow-auto px-3 py-1 text-sm leading-5 prose-p:mt-0 prose-img:mx-auto prose-img:mb-0 prose-img:mt-0 prose-img:max-h-72 prose-img:rounded-md dark:prose-invert"
	>
		{#if note.hasOwnProperty('sanitizedHtml')}
			{@html note.sanitizedHtml}
		{:else}
			{note.text}
		{/if}
	</div>
	<div class="flex h-10 justify-between border-t p-3">
		<button class="flex items-center" on:click={openOptions}>
			<Icon name="options" />
			<span class="sr-only">options</span>
		</button>
		<form
			action="{endpoint}?_method=PATCH"
			method="POST"
			use:enhance={{
				pending: () => (pending_flag = true)
			}}
			class="flex items-center"
		>
			<input type="hidden" name="flag" value={note.flagged} />
			<button
				class="flex items-center border-0 outline-0"
				on:click={() => (note.flagged = !note.flagged)}
				disabled={pending_flag}
			>
				<Icon name="flag" className={note.flagged ? 'fill-red-500' : ''} />
				<span class="sr-only">Toggle flag</span>
			</button>
		</form>
		<a class="flex items-center" href="/{note.articleId}?type=highlight&id={note.id}">
			<Icon name="arrow" />
			<span class="sr-only">go to highlight</span>
		</a>
	</div>
</div>
