<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import Muted from '$lib/components/atoms/Muted.svelte';
	import Button from '$lib/components/Button.svelte';
	import GenericInput from '$lib/components/GenericInput.svelte';
	export let form: { message?: string };
</script>

<!-- TODO: turn this into component -->
<h2 class="text-2xl font-bold">Let's create an account for Margins</h2>
<div class="w-full rounded-lg bg-white p-10 shadow ring-1 ring-black/25 dark:bg-black">
	<form class="flex max-w-xs flex-col space-y-6" use:enhance method="post">
		<div>
			<label for="email"><Muted>Email</Muted></label>
			<GenericInput id="email" type="email" name="email" placeholder="" class="focus:ring-2" />
		</div>
		<div>
			<label for="password"><Muted>Password</Muted></label>
			<GenericInput
				id="password"
				name="password"
				placeholder=""
				type="password"
				class="focus:ring-2"
			/>
		</div>
		<Button type="submit">Sign up</Button>
	</form>
	<p class="text-center font-medium text-red-400">{form?.message || ''}</p>
</div>
<div>
	Already have an account? <a class="font-bold" href="/login">Sign in</a>
</div>
<!-- <a href="/login" class="link">Sign in</a> -->
