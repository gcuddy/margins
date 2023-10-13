<script lang="ts">
	import {
		formatEntryPublished,
		getRevisitLanguage,
		type SlimEntry,
	} from '$lib/utils/entries';

	export let entry: SlimEntry

	import * as Form from '$components/ui/form';

	import type { SuperValidated } from 'sveltekit-superforms';
	import {
		interactionLogInputSchema,
		type InteractionLogInputSchema,
	} from './schema';

	export let form: SuperValidated<InteractionLogInputSchema>;

	import StarRating from '$components/ui/star-rating/star-rating.svelte';
	import { createEventDispatcher } from 'svelte';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { invalidateEntries } from '$lib/queries/mutations';

    $: console.log({form})

	const today = new Date();
	const todayStr = today.toISOString().split('T')[0];

	const dispatch = createEventDispatcher();

	const queryClient = useQueryClient();
</script>

<!-- modeled after letterboxd, shoutout -->

<!-- TODO: wide screen version -->

<div class="flex items-center gap-4">
    {#if entry.image}
	<img
		src={entry.image}
		alt=""
		class=" w-16 aspect-auto rounded-lg shadow-lg"
	/>
    {/if}
	<div class="flex gap-1 items-center">
		<span class="text-base font-semibold leading-none tracking-tight"
			>{entry.title}</span
		>
		{#if entry.published}
			<span class="text-sm text-muted-foreground"
				>{formatEntryPublished(entry)}</span
			>
		{/if}
	</div>
</div>
{#key form}
<Form.Root
	action="/tests/entry/{entry.id}?/logInteraction"
	method="post"
	{form}
	schema={interactionLogInputSchema}
	let:config
	class="grid gap-3"
	let:tainted
	options={{
		// invalidateAll: false,
		onUpdated: ({ form }) => {
			if (form.valid) {
				// invalidateEntries(queryClient);
				dispatch('updated');
			}
		},
        onError: (event) => {
            console.log({event})
        }
	}}
	debug
>
	<input type="hidden" name="entryId" value={entry.id} />
	<Form.Field {config} name="finished">
		<Form.Item>
			<Form.Label>Date</Form.Label>
			<Form.Input
				min="1900-01-01"
				max={todayStr}
				type="date"
				value={todayStr}
			/>
            <Form.Validation />
		</Form.Item>
		<!-- <DateInput visible={false} value={new Date()} closeOnSelection format="yyyy-MM-dd" /> -->
	</Form.Field>
	<Form.Field {config} name="note">
		<Form.Item>
			<Form.Label>Note</Form.Label>
			<Form.Textarea placeholder="Write a note…" />
            <Form.Validation />

		</Form.Item>
	</Form.Field>
	<div class="grid grid-cols-2">
		<Form.Field {config} name="rating" let:value>
            {form.data.rating}
            {value}
			<Form.Item>
				<Form.Label>Rating</Form.Label>
				<StarRating form preventDefault rating={value} />
				<Form.Description
					>{#if value}{value ?? 0} out of 5{/if}</Form.Description
				>
                <Form.Validation />

			</Form.Item>
		</Form.Field>
		<!-- Tags? -->
		<Form.Field {config} name="revisit">
			<Form.Item class="fl">
				{@const revisit = getRevisitLanguage(entry.type)}
				<Form.Label>{revisit}</Form.Label>
				<div class="flex space-x-3 items-center leading-none">
					<Form.Checkbox />
					<Form.Description
						>Is this a {revisit.toLocaleLowerCase()}?</Form.Description
					>
                    <Form.Validation />
				</div>
			</Form.Item>
		</Form.Field>
	</div>
	<div class="flex justify-end items-center gap-4">
		<slot name="footer" {tainted} />
		<Form.Button>Save</Form.Button>
	</div>
</Form.Root>
{/key}
