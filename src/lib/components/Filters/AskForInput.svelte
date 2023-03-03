<script lang="ts">
	import Button from '../Button.svelte';
	import Dialog from '../Dialog.svelte';
	import GenericInput from '../GenericInput.svelte';
	export let open: boolean;
	export let type: 'string' | 'date';
	export let value = type === 'string' ? '' : new Date();
	export let onSave: (val: typeof value) => void = () => undefined;
</script>

<Dialog bind:open class="flex max-w-md flex-col gap-4 p-4">
	<div slot="title">
		{#if type === 'string'}
			Enter content
		{:else if type === 'date'}
			Enter date
		{/if}
	</div>
	{#if type === 'string' && typeof value === 'string'}
		<GenericInput bind:value />
	{:else if type === 'date'}
		TODO: Date picker
	{/if}
	<div class="flex items-center justify-end gap-2">
		<Button size="md" variant="ghost" on:click={() => (open = false)}>Cancel</Button>
		<Button
			size="md"
			on:click={() => {
				onSave(value);
				open = false;
			}}>Save</Button
		>
	</div>
</Dialog>
