<script lang="ts">
	import { Loader2 } from 'lucide-svelte';

	import { Button, Card, Form, Google, Input } from '@margins/ui';
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
	class="fadeInDown w-80"
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

	<!-- Social links: Card footer footer -->
	<div class="p-6">
		<div class="relative flex items-center">
			<div class="border-subtle flex-grow border-t" />
			<span
				class="text-subtle leadning-none mx-2 flex-shrink text-sm font-normal"
			>
				Or continue with
			</span>
			<div class="border-subtle flex-grow border-t" />
		</div>
	</div>
	<div class="px-6 pb-6">
		<Button
			variant="outline"
			href="/login/google"
			class="flex w-full items-center gap-2"
		>
			<Google class="h-3 w-3 saturate-0" />
			Google
		</Button>
	</div>
</Card.Root>

<div class="fadeIn animation-delay-2 text-muted-foreground">
	Already have an account? <a class="font-bold" href="/login">Sign in</a>
</div>
