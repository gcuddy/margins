<script lang="ts">
	import { useQueryClient } from '@tanstack/svelte-query';
	import MarkdownIt from 'markdown-it';
	import { afterUpdate, type ComponentProps } from 'svelte';

	import { invalidate, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { Badge } from '$components/ui/badge'
	import Button from '$components/ui/Button.svelte';
	import Editor from '$components/ui/editor/Editor.svelte';
	import type { TargetSchema } from '$lib/annotation';
	import AnnotationForm from '$lib/components/AnnotationForm.svelte';
	import AnnotationOperations from '$lib/components/AnnotationOperations.svelte';
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import InputText from '$lib/components/ui/form/InputText.svelte';
	import { Blockquote, Muted, Small } from '$lib/components/ui/typography';
	import { mutation } from '$lib/queries/query';
	import type { EntryAnnotation } from '$lib/queries/server';
	import { getTargetSelector } from '$lib/utils/annotations';
	import { formatTimeDuration } from '$lib/utils/dates';
	import Clamp from '$components/Clamp.svelte';
	const md = new MarkdownIt();

	let editor: Editor;

	let pending = false;

	export let annotation: EntryAnnotation;

	const queryClient = useQueryClient();

	type $$Props = {
		annotation: EntryAnnotation;
	} & Omit<ComponentProps<AnnotationForm>, 'annotation'>;

	// hacky way to get types to work with svelte
	const isTarget = (data: unknown): data is TargetSchema => !!data;

	let editing = false;
	let pending_delete = false;

	let lastContentData = annotation.contentData;
	afterUpdate(() => {
		if (lastContentData !== annotation.contentData && annotation.contentData) {
			editor.setContent(annotation.contentData);
			lastContentData = annotation.contentData;
		}
	});

	let focused = false;
</script>

<Card
	class=" transition-shadow {focused ? 'shadow-md' : ''} {pending_delete
		? 'opacity-50'
		: ''}"
>
	<div class="contents" data-sidebar-annotation-id={annotation.id}>
		<CardHeader class="p-3">
			<!--  -->
			<div class="flex items-center justify-between">
				<div>
					{#if annotation.username}
						<Muted>{annotation.username}</Muted>
					{/if}
				</div>
				<div>
					<AnnotationOperations
						{annotation}
						on:delete
						on:edit={() => (editing = true)}
						on:delete={async () => {
							pending_delete = true;
							await mutation($page, 'deleteAnnotation', {
								id: annotation.id,
							});
							await invalidate('entry');
							await queryClient.invalidateQueries({
								queryKey: ['entries'],
							});
							pending_delete = false;
						}}
					/>
					<!-- <Button variant="ghost" size="sm">
					<MoreHorizontal class="h-4 w-4" />
				</Button> -->
				</div>
			</div>
		</CardHeader>
		<CardContent class="grid gap-2 px-3">
			<!--  -->
			{#if isTarget(annotation.target)}
				{@const selector = getTargetSelector(
					annotation.target,
					'TextQuoteSelector',
				)}
				{@const fragment_selector = getTargetSelector(
					annotation.target,
					'FragmentSelector',
				)}
				{#if selector}
					<a on:click href="#annotation-{annotation.id}">
						<Clamp class="border-l-2 pl-6 italic text-sm" as="blockquote" clamp={4}>
							{@html selector.exact}
						</Clamp>
					</a>
				{:else if fragment_selector}
					<!-- TODO: click to jump to timestamp -->
					<span>
						<Badge variant="secondary">
							{@const value = fragment_selector.value.split('=')[1]}
							{formatTimeDuration(+(value ?? '0'), 's')}
						</Badge>
					</span>
				{/if}
			{/if}
			{#if annotation.title && !editing}
				<h3>{annotation.title}</h3>
			{/if}
			{#if annotation.body}
				{#if editing}
					<AnnotationForm
						annotation={{
							body: annotation.body,
							id: annotation.id,
							target: isTarget(annotation.target)
								? annotation.target
								: undefined,
							title: annotation.title ?? undefined,
						}}
						opts={{
							onResult: ({ cancel }) => {
								editing = false;
								cancel();
								invalidateAll();
							},
						}}
						class="grow space-y-2"
						data={$$props.data}
						entry={{
							id: annotation.entryId ?? 0,
						}}
						on:cancel={() => {
							editing = false;
						}}
					>
						<div let:form slot="header">
							<!-- <Input type="text" /> -->
							<InputText
								class="text-xl font-semibold"
								id="annotation-title"
								placeholder="Title"
								{form}
								field={['title']}
							/>
						</div>
					</AnnotationForm>
					<!-- <Textarea
					value={annotation.body}
					class="prose prose-sm prose-stone dark:prose-invert"
				/>
				<Button size="sm">Save</Button> -->
				{:else}
					<div class="prose prose-sm prose-stone dark:prose-invert">
						{@html md.render(annotation.body)}
						<!-- {annotation.body} -->
					</div>
				{/if}
			{/if}
			{#if annotation.contentData}
				<Editor
					on:blur
					id={annotation.id}
					class="border-none p-1 min-h-min"
					focusRing={false}
					content={annotation.contentData}
					options={{ editable: editing && !pending }}
					bind:this={editor}
					onFocus={() => (focused = true)}
					onBlur={() => (focused = false)}
				/>
				{#if editing}
					<div class="flex justify-end gap-x-4">
						<Button
							disabled={pending}
							variant="ghost"
							on:click={() => (editing = false)}>Cancel</Button
						>
						<Button
							disabled={pending}
							variant="secondary"
							on:click={() => {
								pending = true;
								const contentData = editor.getJSON();
								mutation($page, 'save_note', {
									contentData,
									entryId: annotation.entryId ?? undefined,
									id: annotation.id,
									type: annotation.type,
								}).then(() => {
									pending = false;
									editing = false;
									invalidateAll();
								});
							}}>Save</Button
						>
					</div>
				{/if}
				<!-- <div class="prose prose-sm prose-stone dark:prose-invert">
				{@html render_html(annotation.contentData)}
			</div> -->
			{/if}
			{#if annotation.tags.length}
				<div class="flex gap-x-2 mt-2">
					{#each annotation.tags as tag}
						<!-- <a href="/tag/{tag.name}">
					<span class="text-xs text-gray-400">{tag.name}</span>
				</a> -->
						<Badge
							as="a"
							href="/tag/{tag.name}"
							class="font-normal"
							variant="secondary">{tag.name}</Badge
						>
					{/each}
				</div>
			{/if}
		</CardContent>
	</div>
	<!-- <CardFooter class="p-3">
	</CardFooter> -->
</Card>
