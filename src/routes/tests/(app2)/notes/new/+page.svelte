<script lang="ts">
	import { page } from '$app/stores';
	import { IconPicker } from '$components/icon-picker';
	import { TagColorPill } from '$components/tags/tag-color';
	import { TagsCommandPopover } from '$components/tags/tag-command';
	import Badge from '$components/ui/Badge.svelte';

	// import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import Header from '$components/ui/Header.svelte';
	import Textarea from '$components/ui/Textarea.svelte';
	import Editor from '$components/ui/editor/Editor.svelte';
	import autosize from '$lib/actions/autosize';
	import { nanoid } from '$lib/nanoid';
	import { queryFactory } from '$lib/queries/querykeys';
	import { formatDate } from '$lib/utils/date';
	import { defaultParseSearch } from '$lib/utils/search-params';
	import { melt } from '@melt-ui/svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import type { JSONContent } from '@tiptap/core';
	import { onMount, tick } from 'svelte';
	import type { Snapshot } from './$types.js';
	import { updateAnnotationMutation } from '$lib/queries/mutations/index';
	// import NoteSidebar from './NoteSidebar.svelte';
	export let data;

	let editor: Editor;

	const mutation = updateAnnotationMutation({
		showToast: true
	});

	let title = '';
	let textarea: HTMLTextAreaElement;
	let user = data.user_data?.username;

	let contentData: JSONContent;

	export const snapshot: Snapshot = {
		capture: () => {
			console.log('snapshot capturing', { title, contentData });
			return {
				title,
				contentData
			};
		},
		restore: (snapshot) => {
			console.log({ snapshot });
			title = snapshot.title;
			contentData = snapshot.contentData;
		}
	};

	const id = nanoid();

	// TODO: use svelte snapshot to keep note in sessino storage

	let createdAt = new Date();

	const tagsQuery = createQuery(queryFactory.tags.list());

	let tags =
		$page.url.searchParams
			.get('tags')
			?.split(',')
			.map((s) => +s)
			.filter(Boolean) ?? [];

	let selectedTags =
		tags.map((tag) => $tagsQuery.data?.find((t) => t.id === tag)).filter(Boolean) ?? [];

	$: console.log({ selectedTags });

	onMount(() => {
		if (textarea) {
			tick().then(() => {
				textarea?.focus();
			});
		}
	});

	let color = '#000000';
	let icon = 'File';
</script>

<Header>Notes -> {title || 'Untitled note'}</Header>
<div class="flex grow">
	<div
		class="flex flex-col relative shrink-0 max-w-3xl mx-auto justify-stretch items-stretch w-full px-2 py-9"
	>
		<div class="flex flex-col grow-0 px-3">
			<!-- <Textarea
				name="title"
				rows={1}
				class="h-auto resize-none border-none text-xl font-semibold"
				placeholder="Untitled"
			/> -->
			<IconPicker bind:activeColor={color} bind:activeIcon={icon} />
			<textarea
				bind:this={textarea}
				bind:value={title}
				placeholder="Untitled note"
				use:autosize
				rows={1}
				class="w-full h-auto resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none py-3 placeholder:text-muted-foreground/50"
			/>
			<!-- should I do a fancy tool bar component here with that melt-ui component? https://www.melt-ui.com/docs/builders/toolbar -->
			<div class="pt-3 pb-6 px-3 flex flex-wrap items-center gap-1.5">
				<span>
					Created on {formatDate(createdAt)} by {user}
				</span>
				<span>last edited: now</span>
				<!-- <span> This is a toolbar with the created date and by who, tags, last edited time. </span> -->
				{#if $tagsQuery.data}
					<TagsCommandPopover bind:selectedTags let:builder>
						<div class="flex gap-1 flex-wrap" use:melt={builder}>
							{#each selectedTags as tag}
								<!-- as="a" href="/tests/tag/{tag.name}" to decide: should tehse be links or trigger popover? -->
								<Badge>
									<TagColorPill invertDefault class="h-2 w-2 mr-1.5" color={tag.color} />
									{tag.name}
								</Badge>
							{/each}
						</div>
					</TagsCommandPopover>
				{/if}
			</div>
		</div>
		<Editor
			on:blur={({ detail }) => {
				const { editor } = detail;
				contentData = editor.getJSON();
				$mutation.mutate({
					id,
					contentData,
					title,
					type: 'note',
					tags: selectedTags.map((t) => t.id),
					color,
					icon
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
