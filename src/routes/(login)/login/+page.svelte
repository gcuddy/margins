<script lang="ts">
	import { navigating, page } from '$app/stores';
	import Muted from '$lib/components/atoms/Muted.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$components/ui/card';
	import Button from '$components/ui/Button.svelte';
	import Input from '$components/ui/input/input.svelte';
	import Label from '$components/ui/Label.svelte';

	// export let form: { message?: string };
	export let data;
	const { form, errors, constraints, enhance } = superForm(data.form, {
		onError: (e) => {
			console.log('error', e);
		}
	});
	let loading = false;
</script>

<Card>
	<form class="contents" method="post">
		<CardHeader class="space-y-1">
			<CardTitle class="text-2xl">Log in to Margins</CardTitle>
			<CardDescription>Enter your email and password below.</CardDescription>
		</CardHeader>
		<CardContent class="grid gap-4">
			<div class="grid gap-2">
				<Label for="email">Email</Label>
				<Input
					id="email"
					type="email"
					name="email"
					placeholder=""
					autocomplete="email"
					required
					bind:value={$form.email}
					{...$constraints.email}
				/>
			</div>
			<div class="grid gap-2">
				<Label for="password">Password</Label>
				<Input
					id="password"
					name="password"
					required
					placeholder=""
					type="password"
					autocomplete="current-password"
					class="focus:ring-2"
					bind:value={$form.password}
					{...$constraints.password}
				/>
			</div>
		</CardContent>
		<CardFooter>
			<Button class="w-full">Login</Button>
		</CardFooter>
	</form>
</Card>

<div>
	Don't have an account? <a class="font-bold" href="/signup">Sign up</a>
</div>
