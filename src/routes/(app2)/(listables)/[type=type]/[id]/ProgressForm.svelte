<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { Button } from '$components/ui/button';
	import * as Dialog from '$components/ui/dialog';
	import Label from '$components/ui/Label.svelte';
	import { Slider } from '$components/ui/slider';
	export let progress = 0;
	export let isOpen = false;

	const dispatch = createEventDispatcher<{
		save: { progress: number };
	}>();

	$: value = [progress];
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Edit Progress</Dialog.Title>
			<Dialog.Description>Adjust the progress of this item.</Dialog.Description>
		</Dialog.Header>
		<Label for="progress-slider" class="mb-2">
			Progress: {(value[0] ?? 0) * 100}%
		</Label>
		<Slider min={0} max={1} step={0.01} id="progress-slider" bind:value />
		<Dialog.Footer>
			<Button
				on:click={() => {
					const [progress] = value;
					if (progress) {
						dispatch('save', { progress });
						isOpen = false;
					}
				}}>Save changes</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
