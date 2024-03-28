<script lang="ts">
	import { Loader2 } from 'lucide-svelte';

	import { Card, Form, Input } from '@margins/ui';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { createUserSchema } from '../schema';
	import type { PageData } from './$types';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(createUserSchema),
	});

	const { enhance, form: formData, submitting } = form;
</script>

<Card.Root
	class="animate-in fade-in-5 slide-in-from-top-8 duration-500"
	title="Create an account for Margins"
	description="Enter your details below."
>
	<form method="POST" use:enhance>
		<Card.Content class="grid gap-4">
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>
					<Input
						type="email"
						placeholder="johndoe@example.com"
						bind:value={$formData.email}
						{...attrs}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<Form.Label>Password</Form.Label>
					<Input
						type="password"
						placeholder="•••••••••••••"
						{...attrs}
						bind:value={$formData.password}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</Card.Content>
		<Card.Footer>
			<Form.Button
				variant="secondary"
				disabled={$submitting}
				class="bg-foreground text-background hover:bg-foreground w-full"
				>Sign up {#if $submitting}
					<Loader2 class="ml-2 h-4 w-4 animate-spin" />
				{/if}</Form.Button
			>
		</Card.Footer>
	</form>
</Card.Root>

<div>
	Already have an account? <a class="font-bold" href="/login">Sign in</a>
</div>
