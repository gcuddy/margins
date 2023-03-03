<script lang="ts">
	import { enhance } from '$app/forms';
	import { navigating } from '$app/stores';
	import Muted from '$lib/components/atoms/Muted.svelte';
	import Button from '$lib/components/Button.svelte';
	import GenericInput from '$lib/components/GenericInput.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	export let form: { message?: string };
	let loading = false;
</script>

<h2 class="text-2xl font-bold">Log in to Margins</h2>
<div class="rounded-lg bg-white p-10 shadow ring-1 ring-black/25 dark:bg-black">
	<form
		use:enhance={() => {
			loading = true;
			return async ({ result, update }) => {
				await update({
					reset: false,
				});
				loading = false;
			};
		}}
		class="flex max-w-xs flex-col space-y-6"
		method="post"
	>
		<div>
			<!-- TODO: allow email OR username -->
			<label for="email"><Muted>Email</Muted> </label>
			<GenericInput
				id="email"
				name="email"
				placeholder=""
				class="focus:ring-2"
				autocomplete="email"
				required
				type="email"
			/>
		</div>
		<div>
			<label for="password"><Muted>Password</Muted></label>
			<GenericInput
				id="password"
				name="password"
				required
				placeholder=""
				type="password"
				autocomplete="current-password"
				class="focus:ring-2"
			/>
		</div>
		<Button type="submit" className="text-base">
			{#if loading || $navigating}
				<Icon name="loading" className="h-5 w-5 animate-spin text-white" />
			{:else}
				Login
			{/if}
		</Button>
		<p class="text-center font-medium text-red-400">{form?.message || ''}</p>
	</form>
</div>

<div>
	Don't have an account? <a class="font-bold" href="/signup">Sign up</a>
</div>
