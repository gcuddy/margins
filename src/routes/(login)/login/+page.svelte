<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import Muted from '$lib/components/atoms/Muted.svelte';
	import Button from '$lib/components/Button.svelte';
	import GenericInput from '$lib/components/GenericInput.svelte';
	export let form: { message?: string };
</script>

<h2 class="text-2xl font-bold">Log in to Margins</h2>
<div class="rounded-lg bg-white p-10 shadow ring-1 ring-black/25 dark:bg-black">
	<form
		use:enhance={({ data, cancel }) => {
			form = {};
			const email = data.get('email')?.toString() || '';
			const password = data.get('password')?.toString() || '';
			if (!email || !password) {
				form.message = 'Invalid input';
				cancel();
			}
			return async ({ result }) => {
				if (result.type === 'redirect') {
					window.location.href = result.location; // invalidateAll() + goto() will not work
				}
				if (result.type === 'invalid') {
					applyAction(result);
				}
			};
		}}
		class="flex max-w-xs flex-col space-y-6"
	>
		<div>
			<label for="email"><Muted>Email</Muted> </label>
			<!-- <input id="email" name="email" bind:value={email} /> -->
			<GenericInput
				id="email"
				name="email"
				placeholder=""
				class="focus:ring-2"
				autocomplete="email"
				type="email"
			/>
		</div>
		<div>
			<label for="password"><Muted>Password</Muted></label>
			<GenericInput
				id="password"
				name="password"
				placeholder=""
				type="password"
				autocomplete="current-password"
				class="focus:ring-2"
			/>
		</div>
		<Button type="submit" className="text-base">Login</Button>
		<p class="text-center font-medium text-red-400">{form?.message || ''}</p>
	</form>
</div>

<div>
	Don't have an account? <a class="font-bold" href="/signup">Sign up</a>
</div>
