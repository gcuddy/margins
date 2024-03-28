<script lang="ts">
	import { Loader2 } from 'lucide-svelte';
	import { Button, Card, Form, Google, Input } from '@margins/ui';

	import { loginUserSchema } from '../schema';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(loginUserSchema),
	});

	const { enhance, form: formData, submitting } = form;
</script>

<Card.Root
	class=" fadeInDown w-80"
	title="Log in to Margins"
	description="Enter your email and password below."
>
	<form class="contents" use:enhance method="post">
		<Card.Content class="grid gap-4">
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>
					<Input autocomplete="off" {...attrs} bind:value={$formData.email} />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<div class="flex items-center justify-between">
						<Form.Label>Password</Form.Label><a
							tabindex="-1"
							class="text-muted-foreground text-xs hover:underline"
							href="/password-reset">Forgot password?</a
						>
					</div>
					<Input
						{...attrs}
						bind:value={$formData.password}
						type="password"
						autocomplete="current-password"
					/>
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
	<hr class="border-subtle mx-auto mb-8 mt-2 w-[calc(100%-1.5rem)]" />
	<div class="px-6 pb-6">
		<Button
			variant="outline"
			href="/login/google"
			class="flex w-full items-center gap-2"
		>
			<Google class="h-3 w-3 saturate-0" />
			Sign in with Google
		</Button>
	</div>
</Card.Root>

<div class="fadeIn animation-delay-2 text-muted-foreground">
	Don't have an account? <a class="font-bold" href="/signup">Sign up</a>
</div>
