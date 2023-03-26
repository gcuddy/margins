<script lang="ts">
	import { navigating } from "$app/stores";
	import Muted from "$lib/components/atoms/Muted.svelte";
	import Button from "$lib/components/Button.svelte";
	import GenericInput from "$lib/components/GenericInput.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import { superForm } from "sveltekit-superforms/client";
	import toast from "svelte-french-toast";
	import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";

	// export let form: { message?: string };
	export let data;
	const { form, errors, constraints, enhance } = superForm(data.form, {
		onError: (e) => {
			console.log("error", e);
		},
	});
	let loading = false;
</script>

<SuperDebug data={$form} />

<h2 class="text-2xl font-bold">Log in to Margins</h2>
<div class="rounded-lg bg-white p-10 shadow ring-1 ring-black/25 dark:bg-black">
	<form
		use:enhance={{
			// onError: "apply",
			// onSubmit: () => {
			// 	loading = true;
			// 	return async ({ result, update }) => {
			// 		await update({
			// 			reset: false,
			// 		});
			// 		loading = false;
			// 	};
			// },
			onUpdated: ({ form }) => {
				if (form.errors) {
					toast.error("Invalid email or password");
				} else {
					toast.success("Logged in");
				}
			},
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
				bind:value={$form.email}
				type="email"
				{...$constraints.email}
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
				bind:value={$form.password}
				{...$constraints.password}
			/>
		</div>
		<Button type="submit" className="text-base">
			{#if loading || $navigating}
				<Icon name="loading" className="h-5 w-5 animate-spin text-white" />
			{:else}
				Login
			{/if}
		</Button>
		<p class="text-center font-medium text-red-400">{form?.message || ""}</p>
	</form>
</div>

<div>
	Don't have an account? <a class="font-bold" href="/signup">Sign up</a>
</div>
