<script lang="ts">
	import { Loader2 } from 'lucide-svelte';

	import * as Card from '$components/ui/card';
	import * as Form from '$components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { createUserSchema } from '../schema';
	import type { PageData } from './$types';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(createUserSchema),
	});

	const { form: formData, enhance, submitting } = form;
</script>

<Card.Root class="duration-500 animate-in fade-in-5 slide-in-from-top-8">
	<form method="POST" use:enhance>
		<Card.Header>
			<Card.Title class="text-2xl font-semibold tracking-tight"
				>Create an account for Margins</Card.Title
			>
			<Card.Description>Enter your details below.</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>
					<Input type="email" bind:value={$formData.email} {...attrs} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<Form.Label>Password</Form.Label>
					<Input type="password" {...attrs} bind:value={$formData.password} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</Card.Content>
		<Card.Footer>
			<Form.Button
				variant="secondary"
				disabled={$submitting}
				class="w-full bg-foreground text-background hover:bg-foreground"
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
