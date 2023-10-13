<script lang="ts">
	import { Button } from '$components/ui/button';
	import * as Dialog from '$lib/components/ui/alert-dialog';
	import LogInteractionForm from './log-interaction-form.svelte';
	import {
		interactionLogInputSchema,
		type InteractionLogInput,
	} from './schema';
	import { superValidateSync } from 'sveltekit-superforms/server';
	import type { SlimEntry } from '$lib/utils/entries';

	export let open = false;
	export let entry: SlimEntry;

	export let data: Omit<InteractionLogInput, 'entryId'> = {};

	$: form = superValidateSync(
		{
			entryId: entry.id,
			...data,
		},
		interactionLogInputSchema,
	);
    $: console.log({ form });
	export let showTrigger = true;
</script>

<!-- TODO: allow close on escape if not tainted -->
<Dialog.Root bind:open closeOnEscape={false}>
	{#if showTrigger || $$slots.trigger}
		<Dialog.Trigger asChild let:builder>
			<slot name="trigger" {builder}>
				<Button builders={[builder]} variant="outline">Log</Button>
			</slot>
		</Dialog.Trigger>
	{/if}
	<Dialog.Content>
		<Dialog.Title>Log {entry.type}</Dialog.Title>
		{#key form}
			<LogInteractionForm
				{entry}
				{form}
				on:updated={() => {
					open = false;
				}}
			>
				<svelte:fragment slot="footer" let:tainted>
					<Dialog.Cancel
						on:click={(e) => {
							if (tainted) {
								if (
									// could maybe do another alert dialog here instead, but this is fine for now
									!confirm(
										`Are you sure you want to cancel? You have unsaved changes.`,
									)
								) {
									e.preventDefault();
								}
							}
						}}
					>
						Cancel
					</Dialog.Cancel>
				</svelte:fragment>
			</LogInteractionForm>
		{/key}
	</Dialog.Content>
</Dialog.Root>
