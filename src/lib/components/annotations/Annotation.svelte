<script lang="ts">
	import { invalidate, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import Badge from '$components/ui/Badge.svelte';
	import Button from '$components/ui/Button.svelte';
	import Editor from '$components/ui/editor/Editor.svelte';
	import type { TargetSchema } from '$lib/annotation';
	import AnnotationForm from '$lib/components/AnnotationForm.svelte';
	import AnnotationOperations from '$lib/components/AnnotationOperations.svelte';
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import InputText from '$lib/components/ui/forms/InputText.svelte';
	import { Blockquote, Muted, Small } from '$lib/components/ui/typography';
	import type { Annotation } from '$lib/prisma/kysely/types';
	import { QueryOutput, mutation } from '$lib/queries/query';
	import type { EntryAnnotation } from '$lib/queries/server';
	import { getTargetSelector } from '$lib/utils/annotations';
	import { formatTimeDuration } from '$lib/utils/dates';
	import { useQueryClient } from '@tanstack/svelte-query';
	import MarkdownIt from 'markdown-it';
	import { getContext, type ComponentProps } from 'svelte';
	import type { Writable } from 'svelte/store';
	const md = new MarkdownIt();
	const jumping = getContext('jumping') as Writable<boolean>;

	let editor: Editor;

	let pending = false;

	export let annotation: EntryAnnotation;

	$: console.log({ annotation });

	const queryClient = useQueryClient();

	interface $$Props extends Omit<ComponentProps<AnnotationForm>, 'annotation'> {
		annotation: EntryAnnotation;
	}

	// hacky way to get types to work with svelte
	const isTarget = (data: unknown): data is TargetSchema => !!data;

	let editing = false;
	let pending_delete = false;

	let title = !!annotation.title;

	let focused = false;
</script>

<Card class=" transition-shadow {focused ? 'shadow-md' : ''} {pending_delete ? 'opacity-50' : ''}">
	<CardHeader class="p-3">
		<!--  -->
		<div data-sidebar-annotation-id={annotation.id} class="flex items-center justify-between">
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
							id: annotation.id
						});
						await invalidate('entry');
						await queryClient.invalidateQueries({
							queryKey: ['entries']
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
			{@const selector = getTargetSelector(annotation.target, 'TextQuoteSelector')}
			{@const fragment_selector = getTargetSelector(annotation.target, 'FragmentSelector')}
			{#if selector}
				<a
					on:click
					on:click={() => {
						jumping.set(true);
					}}
					href="#annotation-{annotation.id}"
				>
					<Blockquote class="mt-0 line-clamp-4 text-sm">
						{@html selector.exact}
					</Blockquote>
				</a>
			{:else if fragment_selector}
				<!-- TODO: click to jump to timestamp -->
				<span>
					<Small>
						{@const value = fragment_selector.value.split('=')[1]}
						{formatTimeDuration(+(value ?? '0'), 's')}
					</Small>
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
						id: annotation.id,
						body: annotation.body,
						target: isTarget(annotation.target) ? annotation.target : undefined,
						title: annotation.title ?? undefined
					}}
					opts={{
						onResult: ({ cancel }) => {
							editing = false;
							cancel();
							invalidateAll();
						}
					}}
					class="grow space-y-2"
					data={$$props.data}
					entry={{
						id: annotation.entryId ?? 0
					}}
					on:cancel={() => {
						console.log('cancel');
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
					<Button disabled={pending} variant="ghost" on:click={() => (editing = false)}
						>Cancel</Button
					>
					<Button
						disabled={pending}
						variant="secondary"
						on:click={() => {
							pending = true;
							const contentData = editor.getJSON();
							mutation($page, 'save_note', {
								id: annotation.id,
								contentData,
								type: annotation.type,
								entryId: annotation.entryId ?? undefined
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
		{#if annotation.tags?.length}
			<div class="flex gap-x-2 mt-2">
				{#each annotation.tags as tag}
					<!-- <a href="/tests/tag/{tag.name}">
					<span class="text-xs text-gray-400">{tag.name}</span>
				</a> -->
					<Badge as="a" href="/tests/tag/{tag.name}" class="font-normal" variant="secondary"
						>{tag.name}</Badge
					>
				{/each}
			</div>
		{/if}
	</CardContent>
	<!-- <CardFooter class="p-3">
	</CardFooter> -->
</Card>
