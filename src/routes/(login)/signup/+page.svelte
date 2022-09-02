<script lang="ts">
	import Muted from '$lib/components/atoms/Muted.svelte';
	import Button from '$lib/components/Button.svelte';
	import Form from '$lib/components/Form.svelte';
	import GenericInput from '$lib/components/GenericInput.svelte';

	export let errors: { username: string; message: string };
	let username = '';
	let password = '';

	const signup = async (e: SubmitEvent) => {
		const form = e.target as HTMLFormElement;
		form.submit();
	};
</script>

<!-- TODO: turn this into component -->
<h2 class="text-2xl font-bold">Let's create an account for Margins</h2>
<div class="w-full rounded-lg bg-white p-10 shadow ring-1 ring-black/25 dark:bg-black">
	<form
		action="/signup"
		method="post"
		class="flex max-w-xs flex-col space-y-6"
		on:submit|preventDefault={signup}
	>
		<div>
			<label for="username"> <Muted>Username</Muted></label><br />
			<GenericInput
				id="username"
				name="username"
				bind:value={username}
				placeholder=""
				class="focus:ring-2"
			/>
			<p class="error">{errors?.username || ''}</p>
		</div>
		<div>
			<label for="password"><Muted>Password</Muted></label><br />
			<GenericInput
				id="password"
				name="password"
				bind:value={password}
				placeholder=""
				type="password"
				class="focus:ring-2"
			/>
		</div>
		<Button type="submit">Sign up</Button>
	</form>
	<p class="error">{errors?.message || ''}</p>
</div>
<div>
	Already have an account? <a class="font-bold" href="/login">Sign in</a>
</div>
<!-- <a href="/login" class="link">Sign in</a> -->
