<script lang="ts">
	import type { Annotation, AnnotationSchema } from "$lib/annotation";
	import type { Entry } from "@prisma/client";
	import { createEventDispatcher, onMount, tick } from "svelte";
	import { superForm } from "sveltekit-superforms/client";
	import type { Validation } from "sveltekit-superforms/index";
	import Button from "./ui/Button.svelte";
	import Textarea from "./ui/Textarea.svelte";
	import { invalidateAll } from "$app/navigation";

	const dispatch = createEventDispatcher<{
		cancel: undefined;
		save: undefined;
	}>();

	export let data: Validation<AnnotationSchema>;
	export let annotation: Partial<Annotation> | undefined = undefined;
	export let autofocus = false;
	export let entry: Pick<Entry, "id">;
	$: console.log({ data });
	const { enhance, form, submitting, reset, delayed } = superForm(data, {
		dataType: "json",
		// resetForm: true,
		onResult: ({ result, cancel, formEl }) => {
			if (result.type === "success") {
				// dispatch("save");
			}
			// We cancel to prevent the $form store from retaining the posted data
			cancel();
			invalidateAll();
			// reset();
		},
		onUpdated: ({ form }) => {
			console.log("updated", { form });
		},
	});

	$: console.log({ annotation, $form });
	$: annotation &&
		($form = {
			...$form,
			...annotation,
		});

	let textarea: HTMLTextAreaElement;

	onMount(() => {
		console.log("mounting annotationform", { $form });
		if (autofocus) {
			tick().then(() => textarea?.focus());
		}
	});
</script>

<form action="/tests/entry/{entry.id}?/annotate" method="post" use:enhance>
	<div
		class="z-50 flex w-72 flex-col space-y-3 rounded-md border border-slate-100 bg-white p-4 shadow-md outline-none dark:border-slate-800 dark:bg-slate-800"
	>
		<Textarea bind:el={textarea} bind:value={$form.body} />
		<div class="flex items-center justify-end gap-3">
			<Button
				type="reset"
				on:click={() => {
					reset();
					dispatch("cancel");
				}}
				size="sm"
				variant="outline">Cancel</Button
			>
			<!-- on:click={() => dispatch("save")} -->
			<Button class="dark:hover:bg-gray-900" size="sm">Save</Button>
		</div>
	</div>
</form>
