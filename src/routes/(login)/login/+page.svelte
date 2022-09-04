<script lang="ts">
	import Muted from '$lib/components/atoms/Muted.svelte';
	import Button from '$lib/components/Button.svelte';

	import GenericInput from '$lib/components/GenericInput.svelte';

	export let errors: { message: string };
	let username = '';
	let password = '';

	const login = async (e: SubmitEvent) => {
		const form = e.target as HTMLFormElement;
		form.submit();
	};
</script>

<h2 class="text-2xl font-bold">Log in to Margins</h2>
<div class="rounded-lg bg-white p-10 shadow ring-1 ring-black/25 dark:bg-black">
	<form
		on:submit|preventDefault={login}
		action="/login"
		method="post"
		class="flex max-w-xs flex-col space-y-6"
	>
		<div>
			<label for="username"><Muted>Username</Muted> </label>
			<!-- <input id="username" name="username" bind:value={username} /> -->
			<GenericInput
				id="username"
				name="username"
				bind:value={username}
				placeholder=""
				class="focus:ring-2"
				autocomplete="username"
			/>
		</div>
		<div>
			<label for="password"><Muted>Password</Muted></label>
			<GenericInput
				id="password"
				name="password"
				bind:value={password}
				placeholder=""
				type="password"
				autocomplete="current-password"
				class="focus:ring-2"
			/>
		</div>
		<Button type="submit" className="text-base">Login</Button>
		<!-- <input type="password" id="password" name="password" bind:value={password} /><br /> -->
		<!-- <input type="submit" value="Continue" class="button" /> -->
		<p class="error">{errors?.message || ''}</p>
	</form>
</div>

<div>
	Don't have an account? <a class="font-bold" href="/signup">Sign up</a>
</div>
