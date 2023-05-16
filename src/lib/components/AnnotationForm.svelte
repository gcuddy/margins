<script lang="ts">
	import type { AnyZodObject } from 'zod';

	import type { Annotation, AnnotationSchema } from '$lib/annotation';
	import type { Entry } from '@prisma/client';
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { UnwrapEffects, Validation, ZodValidation } from 'sveltekit-superforms/index';
	import Button from './ui/Button.svelte';
	import Textarea from './ui/Textarea.svelte';
	import { invalidateAll } from '$app/navigation';
	import { Loader2Icon } from 'lucide-svelte';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { queryKeys } from '$lib/queries/keys';
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

	let el: HTMLFormElement;

	$: console.log({ data });

	const queryClient = useQueryClient();
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
			queryClient.invalidateQueries({
				queryKey: ['notebook']
			});
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

	let textarea: HTMLTextAreaElement;

	onMount(() => {
		console.log('mounting annotationform', { $form });
		if (autofocus) {
			tick().then(() => textarea?.focus());
		}
	});
</script>

<!-- <div
	class="z-50 flex w-72 flex-col space-y-3 rounded-md border border-slate-100 bg-white p-4 shadow-md outline-none dark:border-slate-800 dark:bg-slate-800"
> -->
<form class={c} action="/tests/entry/{entry.id}?/annotate" method="post" use:enhance bind:this={el}>
	<slot form={superFrm} name="header">
		{#if header}
			<div>{@html header}</div>
		{/if}
	</slot>
	<slot name="content" {el} {form} submitting={$submitting} delayed={$delayed}>
		<Textarea bind:el={textarea} bind:value={$form.body} />
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
