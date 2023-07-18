<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import TooltipContent from '$lib/components/ui/TooltipContent.svelte';
	import { Muted } from '$lib/components/ui/typography';
	// import { useQueryClient } from '@tanstack/svelte-query';
	import { EditIcon, TrashIcon } from 'lucide-svelte';
	import type { ComponentProps } from 'svelte';
	import type { ContentAction } from 'svelte-popperjs';
	import { fly } from 'svelte/transition';
	import FloatingAnnotation from './FloatingAnnotation.svelte';
	import { portal } from 'svelte-portal';
	import { page } from '$app/stores';
	interface $$Props extends ComponentProps<TooltipContent<any>> {
		popperContent: ContentAction<any>;
		id: string;
	}
	export let popperContent: ContentAction<any>;

	import type { PageData } from './$types';
	import type { JSONContent } from '@tiptap/core';

	export let id: string;
	// const queryClient = useQueryClient();

	let show_annotation = false;

	$: annotation = ($page.data as PageData).entry?.annotations?.find((a) => a.id === id);
	$: contentData = annotation?.contentData as JSONContent | undefined;
</script>

{#if !show_annotation}
	<TooltipContent
		class="z-50 w-auto select-none rounded-md border bg-popover p-1 shadow-md outline-none animate-in fade-in fade-out slide-in-from-bottom-3 duration-300"
		on:mouseenter
		on:mouseleave
		{popperContent}
		{...$$restProps}
	>
		<div data-annotation-id={id} class="flex justify-between space-x-2">
			<Button
				on:click={() => {
					show_annotation = true;
				}}
				class="flex h-auto flex-col space-y-1"
				variant="ghost"
			>
				<EditIcon class="h-5 w-5" />
				<Muted class="text-xs">Edit</Muted>
			</Button>
			<form
				use:enhance={() => {
					invalidate('entry');
					// queryClient.invalidateQueries({
					//     queryKey: ['notebook']
					// })
				}}
				class="contents"
				method="post"
				action="?/deleteAnnotation"
			>
				<input type="hidden" name="id" value={id} />
				<Button class="flex h-auto flex-col space-y-1" variant="ghost">
					<TrashIcon class="h-5 w-5" />
					<Muted class="text-xs">Delete</Muted>
				</Button>
			</form>
		</div>
	</TooltipContent>
{/if}
{#if show_annotation}
	<div class="max-w-sm max-h-64" use:portal use:popperContent>
		<FloatingAnnotation annotation_id={id} content={contentData} on:save={(e) => {
            if (annotation) annotation.contentData = e.detail;
        }} />
	</div>
{/if}
