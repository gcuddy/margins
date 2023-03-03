<script lang="ts">
	import { enhance, applyAction } from "$app/forms";
	import Muted from "$lib/components/atoms/Muted.svelte";
	import Button from "$lib/components/Button.svelte";
	import GenericInput from "$lib/components/GenericInput.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import type { ActionData } from "./$types";
	export let form: ActionData;

	let loading = false;
</script>

<!-- TODO: turn this into component -->
<h2 class="text-2xl font-bold">Let's create an account for Margins</h2>
<div class="w-full rounded-lg bg-white p-10 shadow ring-1 ring-black/25 dark:bg-black">
	<form
		class="flex max-w-xs flex-col space-y-6"
		use:enhance={() => {
			loading = true;
			return async ({ result, update }) => {
				update({
					reset: false,
				});
				loading = false;
			};
		}}
		method="post"
	>
		<div>
			<label for="email"><Muted>Email</Muted></label>
			<GenericInput id="email" type="email" name="email" placeholder="" class="focus:ring-2" required />
			{#if form?.errors?.email}
				<p class="text-red-400">{form?.errors?.email}</p>
			{/if}
		</div>
		<div>
			<label for="username"><Muted>Username</Muted></label>
			<GenericInput id="username" type="text" name="username" placeholder="" class="focus:ring-2" required />
			{#if form?.errors?.username}
				<p class="text-red-400">{form?.errors?.username}</p>
			{/if}
		</div>
		<div>
			<label for="password"><Muted>Password</Muted></label>
			<GenericInput
				id="password"
				name="password"
				placeholder=""
				type="password"
				required
				class="focus:ring-2"
			/>
			{#if form?.errors?.password}
				<p class="text-red-400">{form?.errors?.password}</p>
			{/if}
		</div>
		<Button type="submit">
			{#if loading}
				<Icon name="loading" className="h-5 w-5 animate-spin text-white" />
			{:else}
				<span>Sign up</span>
			{/if}
		</Button>
	</form>
	<p class="text-center font-medium text-red-400">{form?.message || ""}</p>
</div>
<div>
	Already have an account? <a class="font-bold" href="/login">Sign in</a>
</div>
<!-- <a href="/login" class="link">Sign in</a> -->
