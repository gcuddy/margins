<script lang="ts">
	import { Loader2 } from 'lucide-svelte';
	import { Card, Form, Input } from '@margins/ui';

	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { usernameSchema } from './schema';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(usernameSchema),
	});

	const { enhance, form: formData, submitting } = form;
</script>

<Card.Root
	class=" fadeInDown w-80"
	title="Create a username"
	description="Start by creating a username. This will be your unique identifier on Margins."
>
	<form class="contents" use:enhance method="post">
		<Card.Content class="grid gap-4">
			<Form.Field {form} name="username">
				<Form.Control let:attrs>
					<Form.Label>Username</Form.Label>
					<Input
						autocomplete="off"
						{...attrs}
						bind:value={$formData.username}
					/>
					<p>
						Your username will be used to create your profile URL. It must be
						unique and can only contain letters, numbers, and underscores.
					</p>
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
		</Card.Content>
		<Card.Footer>
			<Form.Button
				disabled={$submitting}
				variant="secondary"
				class="bg-foreground text-background hover:bg-foreground w-full"
				>Login {#if $submitting}
					<Loader2 class="ml-2 h-4 w-4 animate-spin" />
				{/if}</Form.Button
			>
		</Card.Footer>
	</form>
</Card.Root>
