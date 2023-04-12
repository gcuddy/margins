<script lang="ts">
	import { navigating, page } from "$app/stores";
	import Button from "$lib/components/Button.svelte";
	import Muted from "$lib/components/atoms/Muted.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import Input from "$lib/components/ui/Input.svelte";
	import Label from "$lib/components/ui/Label.svelte";
	import { superForm } from "sveltekit-superforms/client";

	// export let form: { message?: string };
	export let data;
	const { form, errors, constraints, enhance } = superForm(data.form, {
		onError: (e) => {
			console.log("error", e);
		},
	});
	let loading = false;

	$: message = $page.url.searchParams.get("message") ?? "";
</script>

<!-- <SuperDebug data={$form} /> -->

<h2 class="text-2xl font-bold">Log in to Margins</h2>
<div class="rounded-lg bg-white p-10 shadow ring-1 ring-black/25 dark:bg-black">
	<form class="flex max-w-xs flex-col space-y-6" method="post">
		<div>
			<!-- TODO: allow email OR username -->
			<Label for="email"><Muted>Email</Muted></Label>
			<Input
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
			<Label for="password"><Muted>Password</Muted></Label>
			<Input
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
		<!-- <input type="submit" /> -->
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
