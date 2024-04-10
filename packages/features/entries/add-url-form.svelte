<script lang="ts">
	export let action: string;
	import { urlSchema } from './add-url.schema.js';
	import {
		superForm,
	} from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Form, Input } from '@margins/ui';
	import { getReplicache } from '../index.js';
	import { createId } from '@margins/lib';

	export let onSuccess = () => {};
	// export let data: SuperValidated<Infer<typeof urlSchema>>;
	const rep = getReplicache();

	// TODO: maybe spa mode? maybe not?
	const form = superForm(
		{
			url: '',
		},
		{
			SPA: true,
			onUpdate({ form }) {
				if (form.valid) {
					rep.mutate.bookmark_create({
						id: createId(),
						status: 'Backlog',
						uri: form.data.url,
					});
					onSuccess();
				}
			},
			validators: zodClient(urlSchema),
		},
	);

	const { enhance, form: formData } = form;
</script>

<form use:enhance method="post" {action}>
	<Form.Field {form} name="url">
		<Form.Control let:attrs>
			<Form.Label>URL</Form.Label>
			<Input {...attrs} bind:value={$formData.url} type="url" />
			<Form.FieldErrors />
		</Form.Control>
	</Form.Field>
</form>
