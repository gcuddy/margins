<script lang="ts">
	export let data;

	import * as Card from '$components/ui/card';
	import * as Form from '$components/ui/form';
	import { passwordSchema } from './schema';
	import { Loader } from 'lucide-svelte';
	import { page } from '$app/stores';
</script>

<Form.Root
	method="post"
	form={data.form}
	schema={passwordSchema}
	let:config
	let:submitting
	let:message
>
	<Card.Root>
		<Card.Header>
			<Card.Title class="text-2xl font-semibold tracking-tight"
				>Reset your password</Card.Title
			>
			<Card.Description>Enter your new password below.</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<Form.Message
				message={message ?? $page.url.searchParams.get('message')}
			/>
			<Form.Field {config} name="password">
				<Form.Item>
					<Form.Label>Password</Form.Label>
					<Form.Input type="password" />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
		</Card.Content>
		<Card.Footer>
			<Form.Button disabled={submitting} class="w-full"
				>Reset password {#if submitting}
					<Loader class="h-4 w-4 animate-spin ml-2" />
				{/if}</Form.Button
			>
		</Card.Footer>
	</Card.Root>
</Form.Root>
