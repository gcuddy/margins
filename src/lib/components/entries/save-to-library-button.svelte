<script lang="ts">
	import {
		saveToLibrarySchema,
		type SaveToLibrarySchema,
	} from '$lib/schemas/inputs/entry.schema';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let form: SuperValidated<SaveToLibrarySchema> | undefined =
		$page.data.saveToLibraryForm;

	export let bookmark:
		| { id: number; bookmarked_at: Date | null }
		| null
		| undefined = undefined;

	import * as Form from '$components/ui/form';
	import type { ComponentType } from 'svelte';
	import { Plus } from 'radix-icons-svelte';
	import type { ButtonProps } from '$components/ui/button';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { invalidateEntries } from '$lib/queries/mutations';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';

	export let icon: ComponentType | undefined = undefined;

	export let variant: ButtonProps['variant'] = 'default';

	export let text = 'Save';

	const queryClient = useQueryClient();
</script>

<!-- TODO: could change action to be non-dynamic  -->
{#if form}
	<Form.Root
		options={{
			onUpdate(input) {
				console.log('onUpdated', input, 'invalidating');
				// invalidate('entry');
				// invalidateEntries(queryClient);
			},
            onResult({result}) {
                if (result.type === 'success') {
                    console.log('invalidating')
                    invalidateEntries(queryClient);
                }
            },
		}}
		{form}
		action="/{form.data.type}/{form.data.entryId}?/saveToLibrary"
		schema={saveToLibrarySchema}
	>
		<input type="hidden" name="entryId" value={form.data.entryId} />
		<input type="hidden" name="type" value={form.data.type} />
		{#if bookmark}
			<input type="hidden" name="bookmarkId" value={bookmark.id} />
			{#if bookmark.bookmarked_at}
				<input
					type="hidden"
					name="bookmarked_at"
					value={bookmark.bookmarked_at}
				/>
			{/if}
		{/if}
		<!-- <Form.Field {config} name="status">
        </Form.Field> -->
		<Form.Button name="Backlog" {variant}>
			<svelte:component this={icon ?? Plus} class="mr-2 w-4 h-4" />
			<slot>
				{text}
			</slot>
		</Form.Button>
		<!-- <Form.Validation /> -->
	</Form.Root>
{/if}
