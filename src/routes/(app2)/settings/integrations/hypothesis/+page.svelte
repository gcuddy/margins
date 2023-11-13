<script lang="ts">
	import * as Form from '$components/ui/form';
	import { hypothesisSchema } from './schema';

	export let data;
</script>

<Form.Root
    method="post"
	schema={hypothesisSchema}
	form={data.form}
	let:config
	class="space-y-6"
>
	<Form.Item>
		<Form.Field {config} name="apiKey">
			<Form.Label>Hypothes.is API Key</Form.Label>
			<Form.Input placeholder="API Key" />
			<Form.Description>
				You can find your API key on your <a
					class="underline"
					href="https://hypothes.is/account/developer"
					target="_blank"
					>Hypothes.is developer settings page</a
				>  (must be logged in).
			</Form.Description>
			<Form.Validation />
		</Form.Field>
	</Form.Item>
	<Form.Button>Save</Form.Button>
</Form.Root>
