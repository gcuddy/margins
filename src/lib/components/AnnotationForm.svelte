<script lang="ts">
	
	import { invalidateAll } from '$app/navigation';
	import type { Annotation, AnnotationSchema } from '$lib/annotation';
	import type { Entry } from '@prisma/client';
	import { Loader2Icon } from 'lucide-svelte';
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { UnwrapEffects, Validation } from 'sveltekit-superforms/index';
	import Button from './ui/Button.svelte';
	import Textarea from './ui/Textarea.svelte';
	import { draggable } from "@neodrag/svelte" 

	const dispatch = createEventDispatcher<{
		cancel: undefined;
		save: {
			form: Readonly<Validation<UnwrapEffects<AnnotationSchema>, any>> | undefined
		};
		saving: undefined;
	}>();

	export let data: Validation<AnnotationSchema>;
	export let annotation: Partial<Annotation> | undefined = undefined;
	export let autofocus = false;
	export let entry: Pick<Entry, 'id'>;
	let c = '';
	export { c as class };
	export let opts: Parameters<typeof superForm>[1] | undefined = undefined;

	export let footer = true;
	export let header: string | undefined = undefined;

	let _draggable = false;
	export { _draggable as draggable };


	
	let el: HTMLFormElement;

	$: console.log({ data });

	let { validators, ...restOpts } = opts ?? {};
	console.log({ opts });
	const superFrm = superForm(data, {
		// resetForm: true,
		onResult: ({ result, cancel, formEl }) => {
			if (result.type === 'success') {
				dispatch('save', result.data as any);
			}
			// We cancel to prevent the $form store from retaining the posted data
			cancel();
			invalidateAll();
			// reset();
		},
		onUpdated: ({ form }) => {
			console.log('updated', { form });
		},
		...restOpts,
		dataType: 'json'
	});

	const { enhance, form, submitting, reset, delayed } = superFrm;

	$: console.log({ annotation, $form });
	annotation &&
		($form = {
			...$form,
			...annotation
		});

	let textarea: Textarea;

	onMount(() => {
		console.log('mounting annotationform', { $form });
		if (autofocus) {
			// this is the only hack that works to focus it
			setTimeout(() => {
				textarea.focus();
			}, 0);
		}
	});
</script>

<form use:draggable={{
	disabled: !_draggable,
	cancel: 'button, textarea',
	bounds: 'body' // #entry-wrapper is a bit too constraining
}} class={c} action="/tests/entry/{entry.id}?/annotate" method="post" use:enhance bind:this={el}>
	<slot form={superFrm} name="header">
		{#if header}
			<div>{@html header}</div>
		{/if}
	</slot>
	<slot name="content" {el} {form} submitting={$submitting} delayed={$delayed}>
		<Textarea placeholder="Write your note..." class="border-none" bind:this={textarea} bind:value={$form.body} />
	</slot>
	{#if footer}
		<slot name="footer" {form} submitting={$submitting} delayed={$delayed}>
			<div class="mt-2 flex items-center justify-end gap-3">
				<Button
					on:click={(e) => {
						e.preventDefault();
						dispatch('cancel');
					}}
					size="sm"
					variant="outline">Cancel</Button
				>
				<!-- on:click={() => dispatch("save")} -->
				<Button on:click={() => dispatch('saving')} size="sm">
					{#if $delayed}
						<Loader2Icon class="mr-2 h-4 w-4 animate-spin" />
					{/if}
					<span>Save</span>
				</Button>
			</div>
		</slot>
	{/if}
</form>
<!-- </div> -->
