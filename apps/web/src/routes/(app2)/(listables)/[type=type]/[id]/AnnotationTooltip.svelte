<script lang="ts">
	// import { useQueryClient } from '@tanstack/svelte-query';
	import { EditIcon, TrashIcon } from 'lucide-svelte';
	import { type ComponentProps,createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import type { ContentAction } from 'svelte-popperjs';
	import { portal } from 'svelte-portal';

	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import TooltipContent from '$lib/components/ui/TooltipContent.svelte';
	import { Muted } from '$lib/components/ui/typography';

	import FloatingAnnotation from './FloatingAnnotation.svelte';

	type $$Props = {
		popperContent: ContentAction<any>;
		id: string;
	} & ComponentProps<TooltipContent>
	export let popperContent: ContentAction<any>;

	import type { JSONContent } from '@tiptap/core';

	import { clickOutside } from '$lib/actions/clickOutside';

	import type { PageData } from './$types';

	export let id: string;
	// const queryClient = useQueryClient();

	let show_annotation = false;
    $: console.log({show_annotation})

	$: annotation = ($page.data as PageData).entry?.annotations?.find((a) => a.id === id);
	$: contentData = annotation?.contentData as JSONContent | undefined;

	const dispatch = createEventDispatcher();
</script>

{#if !show_annotation}
	<TooltipContent
		class="z-50 w-auto select-none rounded-md border bg-popover p-1 shadow-md outline-none animate-in fade-in fade-out slide-in-from-bottom-3 duration-300"
		on:mouseenter
		on:mouseleave
		{popperContent}
		{...$$restProps}
	>
    <!-- use:clickOutside={() => (show_annotation = false)} -->
		<div
			data-annotation-id={id}
			class="flex justify-between space-x-2"
		>
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
			<form use:enhance class="contents" method="post" action="?/deleteAnnotation">
				<input type="hidden" name="id" value={id} />
				<Button
					on:click={() => dispatch('delete')}
					class="flex h-auto flex-col space-y-1"
					variant="ghost"
				>
					<TrashIcon class="h-5 w-5" />
					<Muted class="text-xs">Delete</Muted>
				</Button>
			</form>
		</div>
	</TooltipContent>
{/if}
{#if show_annotation}
	<div class="max-w-sm max-h-64" use:portal use:popperContent>
		<FloatingAnnotation
			annotation_id={id}
			content={contentData}
			on:save={(e) => {
				if (annotation) annotation.contentData = e.detail;
			}}
		/>
	</div>
{/if}
