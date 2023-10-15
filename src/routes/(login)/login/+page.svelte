<script lang="ts">
	import * as Form from '$components/ui/form';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle,
	} from '$components/ui/card';
	import { loginUserSchema } from '../schema';
	import { page } from '$app/stores';
	import { Loader2 } from 'lucide-svelte';

	export let data;
</script>

<Card class="animate-in fade-in-5 duration-500 slide-in-from-top-8">
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
				message={message ?? $page.url.searchParams.get('message')}
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
					<Form.Label>Password</Form.Label>
					<Form.Input type="password" autocomplete="current-password" />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
		</CardContent>
		<CardFooter>
			<Form.Button disabled={submitting} variant="default" class="w-full"
				>Login {#if submitting}
					<Loader2 class="h-4 w-4 animate-spin ml-2" />
				{/if}</Form.Button
			>
		</CardFooter>
	</Form.Root>
</Card>

<div class="animate-in fade-in-0">
	Don't have an account? <a class="font-bold" href="/signup">Sign up</a>
</div>
