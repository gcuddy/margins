<script lang="ts">
	import { modals } from '$lib/stores/modals';
	import type { Error, Pending, Result } from '$lib/actions/form';

	import Button from './Button.svelte';
	import Form from './Form.svelte';
	import Textarea from './Textarea.svelte';
	import { notifications } from '$lib/stores/notifications';
	export let articleId: number;
	export let method: 'post' | 'patch' = 'post';
	export let action: string = `/${articleId}/annotations`;
	// provided if it's a modal
	export let modalIndex: number | undefined = undefined;
	export let value = '';

	export let done: Result | undefined = () => {
		notifications.notify({
			message: 'Annotation saved!',
			type: 'success'
		});
		modals.close(modalIndex);
	};
	export let error: Error | undefined = ({ error }) => {
		console.error(error);
		notifications.notify({
			message: 'Error saving annotation',
			type: 'error'
		});
	};
	export let pending: Pending | undefined = undefined;
	export let invalidate = `/${articleId}/annotations`;
	console.log({ modalIndex });

	// TODO: meta/ctrl+enter submits form
</script>

<Form {action} {method} {done} {error} {pending} {invalidate}>
	<Textarea autofocus={true} name="text" {value} />
	<Button type="submit">Submit</Button>
</Form>
