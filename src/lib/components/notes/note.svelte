<script lang="ts">
	import { page } from '$app/stores';
	import { IconPicker } from '$components/icon-picker';
	import { TagColorPill } from '$components/tags/tag-color';
	import { TagsCommandPopover } from '$components/tags/tag-command';
	import { Badge } from '$components/ui/badge'
	import Header from '$components/ui/Header.svelte';
	import Editor from '$components/ui/editor/Editor.svelte';
	import autosize from '$lib/actions/autosize';
	import { nanoid } from '$lib/nanoid';
	import { queryFactory } from '$lib/queries/querykeys';
	import { ago, formatDate, now } from '$lib/utils/date';
	import { melt } from '@melt-ui/svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import type { JSONContent } from '@tiptap/core';
	import { onMount, tick } from 'svelte';
	import { updateAnnotationMutation } from '$lib/queries/mutations/index';
	import { deepEqual } from '$lib/helpers';

	export let id = nanoid();
	$: mutation = updateAnnotationMutation({
		input: { id, type: 'document' },
		showToast: true
	});

	let hasBeenUpdate = false;

	export let title: string | null | undefined = '';
	let lastSavedTitle = title;
	export let contentData: JSONContent | undefined = {
		type: 'doc',
		content: [
			{
				type: 'paragraph'
			}
		]
	};
	export let autofocus = false;

	let lastSavedContentData = contentData;
	console.log({ contentData, lastSavedContentData });

	export let color: string = '#000000';
	export let icon = 'File';

	$: console.log({ color, icon });
	let textarea: HTMLTextAreaElement;
	let user = $page.data.user_data?.username;

	// TODO: use svelte snapshot to keep note in sessino storage

	export let createdAt = new Date();
	export let updatedAt: Date | string | undefined = undefined;

	const tagsQuery = createQuery(queryFactory.tags.list());

	export let tagIds =
		$page.url.searchParams
			.get('tags')
			?.split(',')
			.map((s) => +s)
			.filter(Boolean) ?? [];

	export let tags =
		tagIds.map((tag) => $tagsQuery.data?.find((t) => t.id === tag)).filter(Boolean) ?? [];

	let lastSavedTags = [...tags];

	onMount(() => {
		if (textarea && autofocus) {
			tick().then(() => {
				textarea?.focus();
			});
		}
	});
</script>

<Header>Notes -> {title || 'Untitled note'}</Header>
<div class="flex grow">
	<div
		class="flex flex-col relative shrink-0 max-w-4xl mx-auto justify-stretch items-stretch w-full px-2 py-9"
	>
		<div class="flex flex-col grow-0 px-3">
			<!-- <Textarea
				name="title"
				rows={1}
				class="h-auto resize-none border-none text-xl font-semibold"
				placeholder="Untitled"
			/> -->
			<IconPicker
				on:select={({ detail }) => {
					const { icon, color } = detail;
					$mutation.mutate({
						icon,
						color
					});
				}}
				bind:activeColor={color}
				bind:activeIcon={icon}
			/>
			<textarea
				bind:this={textarea}
				bind:value={title}
				on:blur={() => {
					if (title === lastSavedTitle) return;
					$mutation.mutate({
						title
					});
					lastSavedTitle = title;
				}}
				placeholder="Untitled note"
				use:autosize
				rows={1}
				class="w-full h-auto resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none py-3 placeholder:text-muted-foreground/50"
			/>
			<!-- should I do a fancy tool bar component here with that melt-ui component? https://www.melt-ui.com/docs/builders/toolbar -->
			<div class="pt-3 pb-6 flex flex-wrap items-center gap-1.5 text-muted-foreground text-sm">
				<span>
					Created on {formatDate(createdAt)} by {user}
				</span>
				{#if updatedAt}
					<span>last edited: {ago(new Date(updatedAt), $now)}</span>
				{/if}
				<!-- <span> This is a toolbar with the created date and by who, tags, last edited time. </span> -->
				{#if $tagsQuery.data}
					<TagsCommandPopover
						bind:selectedTags={tags}
						let:builder
						onOpenChange={() => {
							if (deepEqual(tags, lastSavedTags)) return;
							$mutation.mutate({
								tags: tags.map((t) => t.id)
							});
							lastSavedTags = [...tags];
						}}
					>
						<div class="flex gap-1 flex-wrap" use:melt={builder}>
							{#each tags as tag}
								<!-- as="a" href="/tests/tag/{tag.name}" to decide: should tehse be links or trigger popover? -->
								<Badge>
									<TagColorPill invertDefault class="h-2 w-2 mr-1.5" color={tag.color} />
									{tag.name}
								</Badge>
							{:else}
								+ Tag
							{/each}
						</div>
					</TagsCommandPopover>
				{/if}
			</div>
		</div>
		<Editor
			onUpdate={(e) => {
				if (hasBeenUpdate) return;
				hasBeenUpdate = true;
				// $mutation.mutate({
				//     contentData: detail.editor.getJSON()
				// })
			}}
			on:blur={({ detail }) => {
				if (!hasBeenUpdate) return;
				const { editor } = detail;
				contentData = editor.getJSON();
				console.time('deepEqual');
				const equal = deepEqual(contentData, lastSavedContentData);
				lastSavedContentData = contentData;
				console.log({ equal, contentData, lastSavedContentData });
				console.timeEnd('deepEqual');
				if (equal) return;
				$mutation.mutate({
					contentData
				});
			}}
			class="grow sm:min-h-[50vh]"
			content={contentData}
			extensions={{
				placeholder: {
					showOnlyWhenEditable: false,
					nonFocusedPlaceholder: 'Type note here...'
					// placeholder: 'Type note here...'
				}
			}}
		/>
	</div>
</div>
