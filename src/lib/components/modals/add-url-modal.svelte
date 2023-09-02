<script lang="ts">
	import Label from '$components/ui/Label.svelte';
	import Input from '$components/ui/input/input.svelte';
	import Dialog from '$components/ui/dialog2/Dialog.svelte';
	import { writable } from 'svelte/store';
	import { enhance } from '$app/forms';
	import Button from '$components/ui/Button.svelte';
	import AddUrlForm from '$components/forms/add-url-form.svelte';

	export let open = writable(false);

	const title = 'Add URL';
	const description = 'Copy and paste the URL to add.';
</script>

<Dialog showClose {open} {title} {description} let:footerClass>
	<AddUrlForm
		on:submit={(e) => {
			open.set(false);
		}}
	>
		<div class={footerClass} slot="footer">
			<Button>Save</Button>
		</div>
	</AddUrlForm>
</Dialog>
