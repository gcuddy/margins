<script>
	import Button from "$lib/components/Button.svelte";
	import { notifications } from "$lib/stores/notifications";
	// import type { PageData } from "./$types";
	import { Confetti } from "svelte-confetti";

	/** @type {import("./$types").PageData} */
	export let data;
	$: ({ codes } = data);

	let copied = false;
	let confetti = false;
</script>

<section>
	<h2 class="text-xl">Account</h2>
	{data.user?.username}
	<div class="flex gap-2">
		<Button variant="ghost" href="/settings/account">Change password</Button>
		<Button variant="ghost" href="/settings/account">Change email</Button>
	</div>
</section>

<section>
	<h2 class="text-xl">Invitation codes</h2>

	{#if codes.length}
		<span>Give this code to a friend to share Margins with them:</span>
		<div class="mx-auto mt-4 flex max-w-md gap-2 rounded-lg bg-primary-300/60 p-3 text-lg shadow-sm">
			<span class="text-gray-800">{codes[0].code}</span>
			<div class="ml-auto">
				{#if confetti}
					<Confetti>test</Confetti>
				{/if}
				<Button
					variant="ghost"
					on:click={() => {
						navigator.clipboard.writeText(codes[0].code);
						notifications.notify({
							title: "Invite code copied!",
							message: "Go ahead and share it with a friend. Invite codes are single use only.",
							type: "success",
						});
						copied = true;
						confetti = true;
						setTimeout(() => {
							copied = false;
							confetti = false;
						}, 5000);
					}}>{copied ? "Copied!" : "Copy"}</Button
				>
			</div>
		</div>
		<!-- <ul>
			{#each codes as { code }}
				<li>{code}</li>
			{/each}
		</ul> -->
	{/if}
</section>
