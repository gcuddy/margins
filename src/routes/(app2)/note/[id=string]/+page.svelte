<script lang="ts">
	import { Skeleton } from '$components/ui/skeleton';
	import { Note } from '$lib/components/notes';
	import {
		initCreatePinMutation,
		initDeletePinMutation,
	} from '$lib/queries/mutations/index';
	import { queryFactory } from '$lib/queries/querykeys';
	import { createQuery } from '@tanstack/svelte-query';

	import Breadcrumbs from '$components/breadcrumbs.svelte';
	import Header from '$components/ui/Header.svelte';
	import { Button } from '$components/ui/button';
	import { cn } from '$lib/utils';
	import { PinIcon } from 'lucide-svelte';
	import AnnotationDetail from './annotation-detail.svelte';
	const pins = createQuery(queryFactory.pins.list());

	const createPin = initCreatePinMutation();
	const removePin = initDeletePinMutation();

	export let data;

	let title = '';

	$: query = createQuery(
		queryFactory.notes.detail({
			id: data.id,
		}),
	);
	$: title = $query.data?.title || '';
	$: console.log({ $query });
	$: pin = $pins.data?.find((p) => p.note?.id === $query.data?.id);
</script>

<Header>
	<div class="flex items-center gap-3">
		<Breadcrumbs
			root={{
				name: 'notes',
				href: '/notebook',
			}}
			path={[
				{
					name:
						title ||
						$query.data?.title ||
						$query.data?.entry?.title ||
						'New note',
					loading: $query.isPending,
				},
			]}
		/>
		<Button
			variant="ghost"
			size="icon"
			on:click={() => {
				// TODO: Pick up here
				if (pin) {
					$removePin.mutate({
						id: pin.id,
					});
				} else if ($query.data) {
					$createPin.mutate({
						annotationId: $query.data?.id,
					});
				}
			}}
		>
			<PinIcon
				class={cn(
					'h-4 w-4 text-muted-foreground',
					pin && 'fill-red-400 text-red-400',
				)}
			/>
			<span class="sr-only">Pin note</span>
		</Button>
	</div>
</Header>
{#if $query.isPending}
	<div class="flex h-full flex-col px-2 py-9">
		<Skeleton class="h-full w-full  max-w-4xl self-center" />
	</div>
	<!-- <Skeleton class="h-full" /> -->
{:else if $query.isSuccess}
	{#key data.id}
		{#if $query.data?.entry}
			<!-- entry note -->
			<AnnotationDetail note={$query.data} />
		{:else}
			<Note
				autofocus={!$query.data}
				on:titlechange={(e) => {
					title = e.detail.title;
				}}
				{...$query.data}
				color={$query.data?.color ?? ''}
				icon={$query.data?.icon ?? ''}
			/>
		{/if}
	{/key}
{/if}
