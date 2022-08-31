<script lang="ts">
	import Form from '$lib/components/Form.svelte';
	import GenericInput from '$lib/components/GenericInput.svelte';

	export let errors: { username: string; message: string };
	let username: string, password: string;

	const signup = async (e: SubmitEvent) => {
		const form = e.target as HTMLFormElement;
		form.submit();
	};
</script>

<div>
	<h2>Create an account</h2>
	<Form action="/signup" method="post">
		<div>
			<label for="username">username</label><br />
			<GenericInput id="username" name="username" bind:value={username} />
			<p class="error">{errors?.username || ''}</p>
		</div>
		<div>
			<label for="password">password</label><br />
			<GenericInput type="password" id="password" name="password" bind:value={password} /><br />
			<input type="submit" value="Continue" class="button" />
		</div>
	</Form>
	<p class="error">{errors?.message || ''}</p>
	<a href="/login" class="link">Sign in</a>
</div>
