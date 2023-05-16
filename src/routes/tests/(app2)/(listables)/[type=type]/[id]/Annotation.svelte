<script lang="ts">
	import type { TargetSchema } from '$lib/annotation';
	import AnnotationForm from '$lib/components/AnnotationForm.svelte';
	import AnnotationOperations from '$lib/components/AnnotationOperations.svelte';
	import MarkdownIt from 'markdown-it';

	const md = new MarkdownIt();
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import { Blockquote, Muted, Small } from '$lib/components/ui/typography';
	import type { Annotation } from '$lib/prisma/kysely/types';
	import type { ComponentProps } from 'svelte';
	import { invalidate, invalidateAll } from '$app/navigation';
	import Input from '$lib/components/ui/Input.svelte';
	import InputText from '$lib/components/ui/forms/InputText.svelte';
	import Label from '$lib/components/ui/Label.svelte';
	import { getTargetSelector } from '$lib/utils/annotations';
	import { mutation } from '$lib/queries/query';
	import { page } from '$app/stores';
	import { formatTimeDuration } from '$lib/utils/dates';
	import { audioPlayer } from '$lib/components/AudioPlayer.svelte';

	export let annotation: Pick<Annotation, 'id' | 'body' | 'target' | 'entryId' | 'title'> & {
		username?: string;
	};

	interface $$Props extends Omit<ComponentProps<AnnotationForm>, 'annotation'> {
		annotation: Pick<Annotation, 'id' | 'body' | 'target' | 'entryId' | 'title'> & {
			username?: string;
		};
	}

	// hacky way to get types to work with svelte
	const isTarget = (data: unknown): data is TargetSchema => !!data;

	let editing = false;
	let pending_delete = false;
</script>

<Card class={pending_delete ? 'opacity-50' : ''}>
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
				<a href="#annotation-{annotation.id}">
					<Blockquote class="mt-0 line-clamp-4 text-sm">
						{@html selector.exact}
					</Blockquote>
				</a>
			{:else if fragment_selector}
			<!-- TODO: click to jump to timestamp -->
				<span>
					<Small>
						{@const value = fragment_selector.value.split("=")[1]}
						{formatTimeDuration(+value, 's')}
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
					class="prose prose-sm prose-slate dark:prose-invert"
				/>
				<Button size="sm">Save</Button> -->
			{:else}
				<div class="prose prose-sm prose-slate dark:prose-invert">
					{@html md.render(annotation.body)}
					<!-- {annotation.body} -->
				</div>
			{/if}
		{/if}
	</CardContent>
	<!-- <CardFooter class="p-3">
	</CardFooter> -->
</Card>
