<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { modals } from '$lib/stores/modals';
	import type { ChosenIcon } from '$lib/types/icon';
	import MiniSwitch from './atoms/MiniSwitch.svelte';
	import Button from './Button.svelte';
	import GenericInput from './GenericInput.svelte';
	import GenericTextarea from './GenericTextarea.svelte';
	import IconPicker from './IconPicker.svelte';
	let chosenIcon: ChosenIcon;
</script>

<form
	method="post"
	action="/u:{$page.params.username}/collection"
	use:enhance={() => {
		modals.close({
			id: 'collection-entry',
		});
		console.log($modals);
		return ({ result, update }) => {
			update();
			invalidate('app:collections');
		};
	}}
>
	<div class="flex flex-col p-3">
		<div />
		<div class="grid grid-cols-[auto_1fr] items-center gap-2 ">
			<div class="flex h-7 w-7 items-center">
				<IconPicker bind:chosenIcon />
				<input type="hidden" name="icon" value={JSON.stringify(chosenIcon)} />
			</div>
			<div class="flex-auto">
				<GenericInput data-initial-focus name="name" variant="naked" class="p-1 font-medium" />
			</div>
			<div class="col-start-2">
				<GenericTextarea
					variant="naked"
					name="description"
					class="p-1 text-sm text-gray-500 dark:text-gray-400"
				/>
			</div>
		</div>
		<div class="flex items-center justify-end gap-2">
			<MiniSwitch
				class="flex items-center justify-between gap-1 text-sm text-gray-500"
				label="Private"
				size="xs"
				enabled
				labelOnRight
				name="private"
			/>
			<Button type="submit">Save</Button>
		</div>
	</div>
</form>
