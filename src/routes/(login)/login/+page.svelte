<script lang="ts">
	import { Loader2 } from 'lucide-svelte';
	import { getFlash } from 'sveltekit-flash-message';

	import { page } from '$app/stores';
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

	export let data;

	const flash = getFlash(page);
</script>

<Card class="duration-500 animate-in fade-in-5 slide-in-from-top-8">
	<Form.Root
		class="contents"
		method="post"
		form={data.form}
		schema={loginUserSchema}
		let:config
		let:message
		let:submitting
	>
		<CardHeader class="space-y-1">
			<CardTitle class="text-2xl font-semibold tracking-tight"
				>Log in to Margins</CardTitle
			>
			<CardDescription>Enter your email and password below.</CardDescription>
		</CardHeader>
		<CardContent class="grid gap-4">
			<Form.Message
				message={message ?? $flash ?? $page.url.searchParams.get('message')}
			/>
			<Form.Field {config} name="email">
				<Form.Item>
					<Form.Label>Email</Form.Label>
					<Form.Input autocomplete="off" />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="password">
				<Form.Item>
					<div class="flex items-center justify-between">
						<Form.Label>Password</Form.Label><a
							class="text-xs text-muted-foreground hover:underline"
							href="/password-reset">Forgot password?</a
						>
					</div>
					<Form.Input type="password" autocomplete="current-password" />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
		</CardContent>
		<CardFooter>
			<Form.Button
				disabled={submitting}
				variant="secondary"
				class="w-full bg-foreground text-background hover:bg-foreground"
				>Login {#if submitting}
					<Loader2 class="ml-2 h-4 w-4 animate-spin" />
				{/if}</Form.Button
			>
		</CardFooter>
	</Form.Root>
</Card>

<div class="animate-in fade-in-0">
	Don't have an account? <a class="font-bold" href="/signup">Sign up</a>
</div>
