<script lang="ts">
	import type { AnnotationSchema, Annotation } from "$lib/annotation";
	import { superForm } from "sveltekit-superforms/client";
	import type { Validation } from "sveltekit-superforms/index";
	import Textarea from "./ui/Textarea.svelte";
	import Button from "./ui/Button.svelte";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher<{
		cancel: undefined;
	}>();

	export let data: Validation<AnnotationSchema>;
	export let target: Annotation["target"] | undefined = undefined;

	const { enhance, form } = superForm(data, {
		dataType: "json",
	});

	$: target && ($form.target = target);
</script>

<div
	class="z-50 flex w-72 flex-col space-y-3 rounded-md border border-slate-100 bg-white p-4 shadow-md outline-none dark:border-slate-800 dark:bg-slate-800"
>
	<Textarea autofocus bind:value={$form.body} />
	<div class="flex items-center justify-end gap-3">
		<Button on:click={() => dispatch("cancel")} size="sm" variant="outline"
			>Cancel</Button
		>
		<Button size="sm">Save</Button>
	</div>
</div>
