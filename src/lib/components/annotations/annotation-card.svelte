<script lang="ts">
	import Editor from '$components/ui/editor/Editor.svelte';
	import type { EntryAnnotation } from '$lib/queries/server';
	import { ago, formatDuration, normalizeTimezone, now } from '$lib/utils/date';

	import * as DropdownMenu from '$components/ui/dropdown-menu';
	import { Button } from '$components/ui/button';
	// import { MoreHorizontalIcon } from 'lucide-svelte';
	import {
		ArrowRight,
		ClipboardCopy,
		DotsHorizontal,
		Pencil1,
		Trash,
	} from 'radix-icons-svelte';
	import { type ComponentProps, tick } from 'svelte';
	import * as Popover from '$components/ui/popover';
	// import { render_html } from '$components/ui/editor/utils';
	import { sleep } from '@melt-ui/svelte/internal/helpers';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { dequal } from 'dequal';
	// import { createAlertDialogStore } from '$lib/stores/dialog';
	import alertDialogStore from '$lib/stores/alert-dialog';
	import {
		invalidateEntries,
		updateAnnotationMutation,
	} from '$lib/queries/mutations';
	import { mutate } from '$lib/queries/query';
	import { invalidate } from '$app/navigation';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { TagIcon } from 'lucide-svelte';
	import { TagsCommand } from '$components/tags/tag-command';
	import { getTargetSelector } from '$lib/utils/annotations';
	import Clamp from '$components/Clamp.svelte';
	import { Badge } from '$components/ui/badge';
	import { slide } from 'svelte/transition';
	import { melt } from '@melt-ui/svelte';
	import type { SetOptional } from 'type-fest';
	import { cn } from '$lib/utils';
	import SlimEntry from '$components/entries/slim-entry.svelte';
	import { make_link } from '$lib/utils/entries';

	let editor: Editor;
	let tainted = false;

	// TODO: combine with other versions of this component that exist lol

	// TODO: should we use this type or not?
	export let annotation: SetOptional<EntryAnnotation, 'username' | 'tags'>;
	export let entry: ComponentProps<SlimEntry>['entry'] | undefined = undefined;
	export let hrefPrefix = '';
    export let autofocus = true;

	let className: string | null | undefined = undefined;
	export { className as class };

	const queryClient = useQueryClient();

	export let isEditing = false;

	let pendingDelete = false;

	const mutation = updateAnnotationMutation({
		input: {
			id: annotation.id,
		},
		invalidateEntries: true,
	});

	$: console.log({ annotation });

	$: if (annotation.contentData && editor) {
		console.log('setting content to contentData', annotation.contentData);
		editor.setContent(annotation.contentData);
	}

	let menuOpen = false;
</script>

<!-- Compare with Card component, AnnotationForm component - it's pretty similar, but some subtle differences. But should we instead use that as our base? -->

<div
	class={cn(
		`min-w-[300px] m-0 flex-1 relative max-w-full border rounded-md bg-card shadow-sm transition group`,
		pendingDelete && 'animate-pulse',
		className,
	)}
>
	<div
		class="w-full relative shadow-none flex flex-col gap-1.5 py-3 px-4 h-full"
	>
		{#if entry}
			<!-- <SlimEntry {entry} link /> -->
			<div class="flex gap-1 items-center">
				<!-- {#if entry.image}
            <img class="h-8 w-8 rounded-full" src={entry.image} />
        {/if} -->
				<a href={make_link(entry)} class="line-clamp-2 font-medium"
					>{entry.title}</a
				>
			</div>
		{/if}
		<div class="flex shrink-0 h-7 justify-between">
			<div class="flex text-xs gap-2">
				{#if annotation.username}
					<span class="font-medium">{annotation.username}</span>
				{/if}
				<time class="text-muted-foreground">
					{ago(new Date(normalizeTimezone(annotation.createdAt)), $now)}
				</time>
			</div>
			{#if !isEditing}
				<div class="flex">
					<DropdownMenu.Root
						bind:open={menuOpen}
						positioning={{
							placement: 'bottom-end',
						}}
					>
						<DropdownMenu.Trigger asChild let:builder>
							<Button
								builders={[builder]}
								variant="ghost"
								size="icon"
								class="h-7 w-7 rounded-sm opacity-0 group-hover:opacity-100  data-[state=open]:opacity-100 transition-opacity group-focus-within:opacity-100"
							>
								<DotsHorizontal class="h-4 w-4" />
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="min-w-[200px]">
							<DropdownMenu.Group>
								<DropdownMenu.Item
									on:click={async () => {
										isEditing = true;
										await sleep(100);
										tick().then(() => {
											editor.focus('end');
										});
									}}
								>
									<Pencil1 class="h-4 w-4 mr-2" /> Edit
								</DropdownMenu.Item>
								<DropdownMenu.Item
									on:click={async () => {
										// Copy to clipboard
										navigator.clipboard.writeText(
											`${$page.url.origin}/note/${annotation.id}`,
										);
									}}
								>
									<ClipboardCopy class="h-4 w-4 mr-2" /> Copy link to annotation
								</DropdownMenu.Item>
								{#if annotation.tags}
									<DropdownMenu.Sub>
										<DropdownMenu.SubTrigger>
											<TagIcon class="h-4 w-4 mr-2" /> Add tag
										</DropdownMenu.SubTrigger>
										<DropdownMenu.SubContent class="p-0">
											<TagsCommand
												bind:open={menuOpen}
												annotationId={annotation.id}
											/>
										</DropdownMenu.SubContent>
									</DropdownMenu.Sub>
								{/if}
							</DropdownMenu.Group>
							<DropdownMenu.Separator />
							<DropdownMenu.Group>
								<DropdownMenu.Item
									on:click={async () => {
										// Copy to clipboard
										goto(`${$page.url.origin}/note/${annotation.id}`);
									}}
								>
									<ArrowRight class="h-4 w-4 mr-2" /> Go to annotation
								</DropdownMenu.Item>
								<!-- TODO -->
								<!-- <DropdownMenu.Item
									on:click={async () => {
										// Copy to clipboard
										goto(`${$page.url.origin}/note/${annotation.id}`);
									}}
								>
									<ArrowRight class="h-4 w-4 mr-2" /> Add to collection
								</DropdownMenu.Item> -->
							</DropdownMenu.Group>
							<DropdownMenu.Separator />
							<DropdownMenu.Group>
								<DropdownMenu.Item
									on:click={() => {
										alertDialogStore.open({
											title: 'Are you sure you want to delete this note?',
											description: 'This action cannot be undone.',
											action: async () => {
												pendingDelete = true;
												await mutate('deleteAnnotation', {
													id: annotation.id,
												});
												await invalidate('entry');
												invalidateEntries(queryClient);
												pendingDelete = false;
											},
										});
									}}
								>
									<Trash class="h-4 w-4 mr-2" />
									Delete
								</DropdownMenu.Item>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			{/if}
		</div>
		{#if annotation.target}
			{@const selector = getTargetSelector(
				annotation.target,
				'TextQuoteSelector',
			)}
			{@const fragment_selector = getTargetSelector(
				annotation.target,
				'FragmentSelector',
			)}
			{#if selector}
				<a on:click href="{hrefPrefix}#annotation-{annotation.id}">
					<Clamp
						on:click={(e) => {
							e.preventDefault();
							// e.stopPropagation();
							// e.stopImmediatePropagation();
						}}
						class="border-l-2 pl-6 italic text-sm hover:border-l-primary"
						as="blockquote"
						clamp={4}
					>
						{@html selector.exact}
					</Clamp>
				</a>
			{:else if fragment_selector}
				{@const value = fragment_selector.value.split('=')[1]}
				<!-- TODO: click to jump to timestamp -->
				{#if value}
					<span>
						<Badge variant="secondary">
							{formatDuration(Number(value), 's', true, ':')}
						</Badge>
					</span>
				{/if}
			{/if}
			<div></div>
		{/if}
		<div>
			{#if isEditing}
				<!-- bind:this={editor} -->
				<!-- This is inefficient - would love to be more selective -->
				{#key annotation.contentData}
					<Editor
						bind:this={editor}
						bind:tainted
						alwaysEditable
						{autofocus}
						options={{
							autofocus: autofocus ?  'end' : false,
						}}
						class="border-0 p-0 min-h-min"
						focusRing={false}
						content={annotation.contentData}
					/>
				{/key}
				<!--  -->
				<!-- alwaysEditable
					readonly={!isEditing} -->
			{:else if annotation.contentData}
				<!-- TODO: this doesn't work if there's nodes — but it should? -->
				<!-- <div class="prose">
					{@html render_html(annotation.contentData)}
				</div> -->
				<Editor
					hideIfEmpty
					readonly
					bind:this={editor}
					class="border-0 p-0 min-h-min"
                    options={{
                        autofocus: false
                    }}
					focusRing={false}
					content={annotation.contentData}
				/>
			{/if}
		</div>
		{#if isEditing}
			<div class="flex justify-end gap-1">
				<Button
					on:click={() => {
						const contentData = editor.getJSON();
						console.log({ contentData });
						console.log({ tainted });

						if (!tainted || dequal(contentData, annotation.contentData)) {
							isEditing = false;
							return;
						}
						// else we need to ask if they want to save
						// TODO: if there are changes, ask if they want to save
						alertDialogStore.open({
							title: 'Discard changes?',
							description:
								'You have unsaved changes. Are you sure you want to discard them?',
							action: () => {
								isEditing = false;
							},
						});
					}}
					variant="ghost"
				>
					Cancel
				</Button>
				<Button
					on:click={() => {
						const contentData = editor.getJSON();
						console.log({ tainted });
						if (!tainted || dequal(contentData, annotation.contentData)) {
							isEditing = false;
							return;
						}
						$mutation.mutate({ contentData });
						annotation.contentData = contentData;
						isEditing = false;
					}}
					variant="secondary"
				>
					Save
				</Button>
			</div>
		{/if}
		{#if annotation.tags}
			<Popover.Root>
				<Popover.Trigger asChild let:builder>
					<div
						use:melt={builder}
						class="flex items-center gap-1"
						transition:slide={{ duration: 150 }}
					>
						{#each annotation.tags as tag (annotation.id)}
							<Badge variant="secondary" class="mr-1">
								{tag.name}
							</Badge>
						{/each}
					</div>
				</Popover.Trigger>
				<Popover.Content class="p-0">
					<TagsCommand
						selectedTags={annotation.tags}
						annotationId={annotation.id}
					/>
				</Popover.Content>
			</Popover.Root>
		{/if}
	</div>
	<!-- {JSON.stringify(annotation)} -->
	<!-- <button on:click={() => (isEditing = !isEditing)}> done </button> -->
	<!-- TODO: reply -->
</div>
