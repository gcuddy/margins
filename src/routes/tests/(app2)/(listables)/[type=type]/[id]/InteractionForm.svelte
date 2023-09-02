<script lang="ts">
	import type { Entry } from "@prisma/client";
	import { superForm } from "sveltekit-superforms/client";
	import type { Validation } from "sveltekit-superforms/index";

	import Button from "$lib/components/ui/Button.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import Label from "$lib/components/ui/Label.svelte";
	import type { InteractionSchema } from "$lib/schemas";

	export let data: Validation<InteractionSchema>;
	export let entry: Pick<Entry, "id" | "type">;
	const { form, enhance } = superForm(data);
	import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";

	$: console.log({ data });
	$: console.log({ $form });
</script>

<SuperDebug data={$form} />

<form
	action="/tests/{entry.type}/{entry.id}?/interaction"
	method="post"
	use:enhance
>
	<input type="hidden" name="entryId" value={$form.entryId || entry.id} />
	<Input name="title" bind:value={$form.title} placeholder="Optional title" />
	<!-- optional note -->

	<!-- date started -->
	<Label for="date">Date started</Label>
	<input
		bind:value={$form.date_started}
		type="date"
		name="date_started"
		id="date"
	/>

	<Button>Save</Button>
</form>

<!-- Rating? -->
