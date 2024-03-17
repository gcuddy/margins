<script lang="ts">
	export let data;

	import { Loader } from 'lucide-svelte';

	import { page } from '$app/stores';
	import * as Card from '$components/ui/card';
	import * as Form from '$components/ui/form';

	import { emailSchema } from './schema';ui/form';

	import { createUserSchema } from '../schema';
</script>

<Card.Root class="duration-500 animate-in fade-in-5 slide-in-from-top-8">
	<Form.Root
		class="contents"
		method="post"
		form={data.form}
		schema={createUserSchema}
		let:config
		let:submitting
		let:message
	>
		<Card.Header>
			<Card.Title class="text-2xl font-semibold tracking-tight"
				>Create an account for Margins</Card.Title
			>
			<Card.Description>Enter your details below.</Card.Description>
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
			<Form.Field {config} name="username">
				<Form.Item>
					<Form.Label>Username</Form.Label>
					<Form.Input />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="password">
				<Form.Item>
					<Form.Label>Password</Form.Label>
					<Form.Input type="password" />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<!-- <Form.Field {config} name="inviteCode"> -->
			<!-- 	<Form.Item> -->
			<!-- 		<Form.Label>Invite Code (if you have one)</Form.Label> -->
			<!-- 		<Form.Input /> -->
			<!-- 		<Form.Validation /> -->
			<!-- 	</Form.Item> -->
			<!-- </Form.Field> -->
		</Card.Content>
		<Card.Footer>
			<Form.Button
				variant="secondary"
				disabled={submitting}
				class="w-full bg-foreground text-background hover:bg-foreground"
				>Sign up {#if submitting}
					<Loader2 class="ml-2 h-4 w-4 animate-spin" />
				{/if}</Form.Button
			>
		</Card.Footer>
	</Form.Root>
</Card.Root>

<div>
	Already have an account? <a class="font-bold" href="/login">Sign in</a>
</div>
