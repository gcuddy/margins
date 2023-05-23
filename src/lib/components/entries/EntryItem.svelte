<script lang="ts">
	import { preloadCode, preloadData } from '$app/navigation';
	import smoothload from '$lib/actions/smoothload';
	import type { EntryInList } from '$lib/db/selects';
	import { getId, getType } from '$lib/utils/entries';
	import clsx from 'clsx';
	import ImageSkeleton from '../ui/skeleton/ImageSkeleton.svelte';
	import { Muted, Small } from '../ui/typography';
	import { createEventDispatcher, tick } from 'svelte';
	import Progress from '../ui/Progress.svelte';
	import { receive, send } from '$lib/transitions';
	import type { Status } from '@prisma/client';
	import Badge from '../ui/Badge.svelte';
	import { page } from '$app/stores';

	export let entry: EntryInList;
	function getDomain(url: string) {
		const domain = url.replace(/https?:\/\//, '').split('/')[0];
		return domain;
	}

	const dispatch = createEventDispatcher<{ checked: boolean }>();

	export let checked = false;

	$: href = `/tests/${getType(entry.type)}/${getId(entry)}`;

	export let out_key: Status = 'Archive';

	export async function move_entry(status: Status) {
		out_key = status;
		// await tick();
	}

	$: if (checked) {
		dispatch('checked', checked);
	} else {
		dispatch('checked', checked);
	}

	let anchor_el: HTMLAnchorElement;
</script>

<!-- out:send|local={{
			key: `${out_key.toLowerCase()}-${entry.id}`,
		}} -->
<div class="flex grow items-center gap-x-4">
	<div
		class="group/select relative h-16 w-16 shrink-0 overflow-hidden rounded-md object-cover ring-offset-background group-focus-within:ring-2 group-focus-within:ring-ring group-focus-within:ring-offset-2"
	>
		{#if entry.image || entry.uri}
			{@const src = entry.image?.startsWith('/')
				? $page.data.S3_BUCKET_PREFIX + entry.image.slice(1)
				: entry.image}
			<img
				use:smoothload
				src={src ?? `https://icon.horse/icon/${getDomain(entry.uri ?? '')}`}
				on:error={(e) => {
					if (entry.uri) {
						//@ts-ignore
						e.target.src = `https://icon.horse/icon/${getDomain(entry.uri)}`;
					}
				}}
				alt=""
				class={clsx(
					'relative h-16 w-16 shrink-0 overflow-hidden rounded-md object-cover',
					checked && 'invisible'
				)}
			/>
		{:else}
			<!--  -->
			<ImageSkeleton class="relative h-16 w-16 object-cover" />
		{/if}
		<div class="absolute inset-0 z-[2] h-full w-full overflow-hidden rounded-md">
			<input
				bind:checked
				type="checkbox"
				class="relative h-full w-full cursor-pointer appearance-none before:absolute before:inset-2 before:rounded-md checked:bg-input checked:!ring-0 group-hover/select:ring-8 group-hover/select:ring-inset group-hover/select:ring-ring checked:group-hover/select:bg-opacity-80"
				on:focus={() => {
					anchor_el?.focus();
				}}
			/>
		</div>
	</div>
	<div class="flex flex-col">
		<Muted class="text-xs">{entry.type}</Muted>
		<a
			bind:this={anchor_el}
			on:focus|once={(e) => {
				console.log('focused', e);
				console.log({ href });
				preloadData(href);
			}}
			on:focus
			on:keydown={(e) => {
				if (e.key === 'x') {
					e.preventDefault();
					e.stopPropagation();
					checked = !checked;
				}
			}}
			data-id={entry.id}
			class="line-clamp-2 font-semibold hover:underline focus:outline-none"
			{href}
			on:click
		>
			{entry.title}
		</a>
		<div class="flex">
			{#if entry.author}
				<Muted class="text-xs">{entry.author}</Muted>
			{/if}
		</div>
	</div>
	<div class="ml-auto hidden shrink-0 items-center gap-x-2 md:flex">
		{#if entry.tags}
			{#each entry.tags as tag (tag.id)}
				<Badge class="text-xs" as="a" href="/tests/tag/{tag.name}" variant="outline"
					>{tag.name}</Badge
				>
			{/each}
		{/if}
		{#if entry.wordCount}
			<Small class="text-xs">
				{entry.wordCount} words
			</Small>
		{/if}
		{#if entry.progress}
			<Small class="text-xs">
				{Math.round(entry.progress * 100)}%
			</Small>
		{/if}
	</div>
</div>
