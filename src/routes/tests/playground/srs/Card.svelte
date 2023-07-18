<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$components/ui/Button.svelte';
	import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '$components/ui/card';
	import OptionsMenu from '$components/ui/dropdown-menu/OptionsMenu.svelte';
	import type { AnnotationWithEntry } from '$lib/db/selects';
	import { md } from '$lib/markdown';
	import { make_link } from '$lib/utils/entries';

	export const [send, receive] = crossfade({
		// delay: 500,
		duration: (d) => Math.sqrt(d * 200),
		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

	import type { Annotation } from '@prisma/client';
	import {
		CheckCircle2Icon,
		ChevronsRightIcon,
		CircleSlashIcon,
		EyeIcon,
		InfoIcon,
		MoreVerticalIcon,
		TrashIcon
	} from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { crossfade, fade, fly, scale } from 'svelte/transition';

	export let note: {
		body: string | null;
		id: string;
		response: string | null;
	} & AnnotationWithEntry;

	// TODO: use url params for js-free (or post answer and get from cookies or something)
	let show_answer = false;

	let pending = false;

    let show_info = false;

	type Event = 'Remembered' | 'Forgotten' | 'Deleted';

	const dispatch = createEventDispatcher<{
		done: {
			type: Event;
		};
	}>();

	$: body = md.render(note.body ?? '');
	$: response = md.render(note.response ?? '');

	//   $: source =
</script>

<!-- h-96 -->
<div
	class="rounded-lg border bg-card text-card-foreground shadow-sm p-8 max-w-prose flex flex-col justify-between"
>
	<div class="flex justify-end">
		{#if show_answer}
			<span
				in:receive={{
					key: 'body'
				}}
				class="tracking-[-0.011em]"
			>
				{@html body}
			</span>
		{/if}
		<OptionsMenu
			size="xs"
			variant="secondary"
			items={[
				[
					{
						text: 'Show Info',
						icon: InfoIcon,
						onSelect: () => {
							console.log({note});
                            show_info = true;
						}
					},
					{
						text: 'Delete',
						icon: TrashIcon,
						onSelect: () => {
							pending = true;
							fetch(`/tests/playground/srs/${note.id}?/delete`, {
								method: 'POST',
								body: JSON.stringify({})
							}).then(() => {
								pending = false;
								dispatch('done', {
                                    type: 'Deleted'
                                });
							});
						}
					}
				]
			]}
		>
			<svelte:fragment slot="trigger">
				<MoreVerticalIcon class="h-5 w-5" />
			</svelte:fragment>
		</OptionsMenu>
	</div>
	<div class="py-8 grid grid-cols-1 grid-rows-1 text-xl tracking-[-0.017em]">
		{#if !show_answer}
			<span
				class="col-start-1 row-start-1"
				out:send={{
					key: 'body',
					duration: 200
				}}
			>
				{@html body}
			</span>
		{:else}
			<span in:fly={{ delay: 200, y: 10 }} class="col-start-1 row-start-1">
				{@html response}
			</span>
		{/if}
		<!-- data: -->
		<!-- {JSON.stringify(note)} -->
	</div>
	{#if show_answer}
		<form
			use:enhance={({ formData }) => {
				pending = true;
				const remembered = +(formData.get('remembered') || 0);

				return async ({ update }) => {
					await update();
					// Get results and update state of this Card, and bind that to the parent component
					pending = false;
					dispatch('done', { type: remembered ? 'Remembered' : 'Forgotten' });
				};
			}}
			action="/tests/playground/srs/{note.id}?/mark"
			method="post"
		>
			<Button disabled={pending} name="remembered" value={0} type="submit">
				<CircleSlashIcon class="h-5 w-5 mr-2" />
				Forgotten
			</Button>
			<Button disabled={pending} name="remembered" value={1} type="submit">
				<CheckCircle2Icon class="h-5 w-5 mr-2" />
				Remembered
			</Button>
		</form>
	{:else}
		<div class="flex justify-between">
			<Button
				on:click={() => {
					show_answer = true;
				}}
				size="lg"
			>
				<EyeIcon class="h-5 w-5 mr-2" />
				Show Answer
			</Button>
			{#if note.entry}
				<Button
					as="a"
					href={make_link(note.entry, `annotation-${note.id}`)}
					on:click={() => {
						console.log({ note });
					}}
					variant="ghost"
				>
					<ChevronsRightIcon class="h-5 w-5 mr-2" />
					View Source
				</Button>
			{/if}
		</div>
	{/if}
    {#if show_info}
        <span>Due: </span>
    {/if}
</div>
