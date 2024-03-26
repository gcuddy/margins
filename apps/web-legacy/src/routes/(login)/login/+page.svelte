<script lang="ts">
	import { Loader2 } from 'lucide-svelte';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle,
	} from '$components/ui/card';
	import * as Form from '$components/ui/form';

	import { loginUserSchema } from '../schema';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$components/ui/input';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(loginUserSchema),
	});

	const { form: formData, enhance, submitting } = form;
</script>

<Card class="duration-500 animate-in fade-in-5 slide-in-from-top-8">
	<form class="contents" use:enhance method="post">
		<CardHeader class="space-y-1">
			<CardTitle class="text-2xl font-semibold tracking-tight"
				>Log in to Margins</CardTitle
			>
			<CardDescription>Enter your email and password below.</CardDescription>
		</CardHeader>
		<CardContent class="grid gap-4">
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
							class="text-xs text-muted-foreground hover:underline"
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
		</CardContent>
		<CardFooter>
			<Form.Button
				disabled={$submitting}
				variant="secondary"
				class="w-full bg-foreground text-background hover:bg-foreground"
				>Login {#if $submitting}
					<Loader2 class="ml-2 h-4 w-4 animate-spin" />
				{/if}</Form.Button
			>
		</CardFooter>
	</form>
</Card>

<div class="animate-in fade-in-0">
	Don't have an account? <a class="font-bold" href="/signup">Sign up</a>
</div>
