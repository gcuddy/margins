<script lang="ts">
	export let data;

	import { Loader } from 'lucide-svelte';

	import { page } from '$app/stores';
	import * as Card from '$components/ui/card';
	import * as Form from '$components/ui/form';

	import { emailSchema } from './schema';
</script>

<Form.Root
	method="post"
	form={data.form}
	schema={emailSchema}
	let:config
	let:submitting
	let:message
>
	<Card.Root>
		<Card.Header>
			<Card.Title class="text-2xl font-semibold tracking-tight"
				>Reset your password</Card.Title
			>
			<Card.Description
				>Enter your email below to reset your password.</Card.Description
			>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<Form.Message
				message={message ?? $page.url.searchParams.get('message')}
			/>
			<Form.Field {config} name="email">
				<Form.Item>
					<Form.Label>Email</Form.Label>
					<Form.Input type="email" />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
		</Card.Content>
		<Card.Footer>
			<Form.Button
				disabled={submitting}
				class="w-full bg-foreground text-background hover:bg-foreground"
				variant="secondary"
				>Send reset link {#if submitting}
					<Loader class="ml-2 h-4 w-4 animate-spin" />
				{/if}</Form.Button
			>
		</Card.Footer>
	</Card.Root>
</Form.Root>
