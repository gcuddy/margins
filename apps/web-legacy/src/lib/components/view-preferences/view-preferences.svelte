<script lang="ts">
	import { createMutation } from '@tanstack/svelte-query';
	import { Settings2Icon } from 'lucide-svelte';

	import { Button } from '$components/ui/button';
	import * as DropdownMenu from '$components/ui/dropdown-menu';
	import { deepEqual } from '$lib/helpers';
	import { nanoid } from '$lib/nanoid';
	import { mutate } from '$lib/queries/query';
	import { normalizeCamelCase } from '$lib/utils';

	import {
		defaultViewPreferences,
		type ViewPreferences,
		viewPreferencesKeys,
	} from './view-preferences.schema';

	let className: string | null | undefined = undefined;
	export { className as class };
	export let id = nanoid();
	export let viewPreferences: ViewPreferences = defaultViewPreferences;
	let previousViewPreferences = { ...viewPreferences };

	/** Defaults to automatically saving viewPreferences. */
	export let onClose: () => void = () => {
		// console.log('onClose', { viewPreferences, previousViewPreferences });
		if (deepEqual(viewPreferences, previousViewPreferences)) {
			// console.log('no change');
			return;
		}
		$mutation.mutate();
		previousViewPreferences = { ...viewPreferences };
	};
	export let onChange: (
		open: boolean | 'indeterminate' | undefined,
	) => void = () => {};

	const mutation = createMutation({
		mutationFn: async () =>
			mutate('viewPreferencesUpdate', {
				id,
				input: {
					preferences: viewPreferences,
				},
			}),
	});
</script>

<!-- TODO: don't close on click -->

<DropdownMenu.Root
	positioning={{
		placement: 'bottom-end',
	}}
	onOpenChange={(open) => {
		if (!open) {
			onClose();
		}
	}}
>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="outline" size="sm" class={className} builders={[builder]}>
			<Settings2Icon class="w-4 h-4 mr-2" />
			View</Button
		>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Label>Toggle display properties</DropdownMenu.Label>
		<DropdownMenu.Separator />
		{#each viewPreferencesKeys as key}
			<DropdownMenu.CheckboxItem
				bind:checked={viewPreferences[key]}
				onCheckedChange={onChange}
			>
				{#if key === 'url'}
					URL
				{:else}
					{normalizeCamelCase(key)}
				{/if}
			</DropdownMenu.CheckboxItem>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
