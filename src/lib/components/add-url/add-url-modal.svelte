<script lang="ts">
	import AddUrlForm from './add-url-form.svelte';
	import { Button } from '$components/ui/button';
	import * as Dialog from '$components/ui/dialog';
	import { writable } from 'svelte/store';

	export let open = writable(false);

	const title = 'Add URL';
	const description = 'Copy and paste the URL to add.';
</script>

<Dialog.Root bind:open={$open}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>
				{title}
			</Dialog.Title>
			<Dialog.Description>
				{description}
			</Dialog.Description>
		</Dialog.Header>
		<AddUrlForm
			on:submit={(e) => {
				open.set(false);
			}}
		>
			<Dialog.Footer slot="footer">
				<Button>Save</Button>
			</Dialog.Footer>
		</AddUrlForm>
	</Dialog.Content>
</Dialog.Root>
