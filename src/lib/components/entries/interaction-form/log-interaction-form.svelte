<script lang="ts">
	import { getRevisitLanguage, type SlimEntry } from '$lib/utils/entries';

	export let entry: Omit<SlimEntry, 'id'> | undefined = undefined;

	/**
	 * Use this to override the entryId in the form
	 */
	export let entryId: number | undefined = undefined;

	export let partialProgress = false;

	let showProgress = false;

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
	import SlimEntryDisplay from '../slim-entry.svelte';

	$: console.log({ form });

	const today = new Date();
	const todayStr = today.toISOString().split('T')[0];

	const dispatch = createEventDispatcher();

	const queryClient = useQueryClient();
</script>

{#if entry}
	<SlimEntryDisplay {entry} />
{/if}
<Form.Root
	action="/{form.data.type}/{form.data.entryId}?/logInteraction"
	method="post"
	{form}
	schema={interactionLogInputSchema}
	let:config
	class="grid gap-3"
	let:tainted
	options={{
		invalidateAll: true,
		onUpdated: ({ form }) => {
			if (form.valid) {
				invalidateEntries(queryClient);
				dispatch('updated');
			}
		},
		onError: (event) => {
			console.log({ event });
		},
	}}
>
	<input type="hidden" name="entryId" value={form.data.entryId} />
	<input type="hidden" name="type" value={form.data.type} />
	{#if entryId}
		<input type="hidden" name="_entryId" value={entryId} />
	{/if}
	{#if !showProgress}
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
	{:else}
        <Form.Field {config} name="progress">
            <Form.Item>
                <Form.Label>Progress</Form.Label>
                <Form.Input type="number" min="0" max="100" />
                <Form.Validation />
            </Form.Item>
        </Form.Field>
    {/if}
	<Form.Field {config} name="note">
		<Form.Item>
			<Form.Label>Note</Form.Label>
			<Form.Textarea placeholder="Write a note…" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<div class="grid grid-cols-2">
		<Form.Field {config} name="rating" let:value>
			<Form.Item>
				<Form.Label>Rating</Form.Label>
				<StarRating form preventDefault rating={value} />
				{#if value}
					<input type="hidden" name="rating" {value} />
				{/if}
				<Form.Description
					>{#if value}{value ?? 0} out of 5{/if}</Form.Description
				>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<!-- Tags? -->
		<Form.Field {config} name="revisit">
			<Form.Item class="fl">
				{@const revisit = getRevisitLanguage(form.data.type)}
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
