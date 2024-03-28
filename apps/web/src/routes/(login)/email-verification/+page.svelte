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

	import { tokenSchema } from './schema';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { PinInput } from 'bits-ui';
	import { VERIFICATION_CODE_LENGTH } from '$lib/auth/constants';
	import FormMessage from '$components/ui/form/form-message.svelte';
	import { page } from '$app/stores';
	import { Button } from '$components/ui/button';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(tokenSchema),
	});

	const { enhance, form: formData, message, submitting } = form;
</script>

<Card
	class="animate-in fade-in-5 slide-in-from-top-8 duration-500 sm:min-w-[300px]"
>
	<form class="contents" action="?/verify" use:enhance method="post">
		<CardHeader class="space-y-1">
			<CardTitle class="text-2xl font-semibold tracking-tight"
				>Verify Email</CardTitle
			>
			<CardDescription>Enter your verification code</CardDescription>
		</CardHeader>
		<CardContent class="grid gap-4">
			<Form.Field {form} name="code">
				<Form.Control let:attrs>
					<Form.Label>Verification Code</Form.Label>
					<PinInput.Root
						type="text"
						placeholder=""
						class="flex items-center"
						{...attrs}
						bind:value={$formData.code}
					>
						{#each new Array(VERIFICATION_CODE_LENGTH) as _}
							<PinInput.Input
								class="border-input focus-within:ring-ring relative flex h-9 w-9 border-y border-r text-center text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md focus-within:z-10 focus-within:ring"
							/>
						{/each}
						<PinInput.HiddenInput />
					</PinInput.Root>
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
			<FormMessage subtle message={$message}>
				{#if $page.status === 403}
					<Button
						formaction="?/request"
						type="submit"
						size="sm"
						variant="link"
						class="text-foreground px-0 text-xs"
						>Request new verification code</Button
					>
				{/if}
			</FormMessage>
		</CardContent>
		<CardFooter>
			<Form.Button
				disabled={$submitting}
				variant="secondary"
				class="bg-foreground text-background hover:bg-foreground w-full"
				>Verify {#if $submitting}
					<Loader2 class="ml-2 h-4 w-4 animate-spin" />
				{/if}</Form.Button
			>
		</CardFooter>
	</form>
</Card>
