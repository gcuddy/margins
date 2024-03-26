<script lang="ts">
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import { Button } from '$components/ui/button';
	import * as Dialog from '$components/ui/dialog';
	import type Editor from '$components/ui/editor/Editor.svelte';
	import { mutate, type MutationInput } from '$lib/queries/query';

	import AddAnnotationForm from './add-annotation-form.svelte';

	export let type: 'timestamp' = 'timestamp';
	export let entryId: number;

	export let open = false;

	let tags: Array<{ color: string; id: number; name: string }> = [];
	let timestamp: string;
	let title = '';

	// TODO: use existing mutation

	const queryClient = useQueryClient();

	const mutation = createMutation({
		mutationFn: (input: MutationInput<'save_note'>) =>
			mutate('save_note', input),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['entries'],
			});
			queryClient.invalidateQueries({
				queryKey: ['notes'],
			});
		},
	});

	let editor: Editor;

	const normalizeTimestamp = (timestamp: string) => {
		// first, make sure it's in format hh:mm:ss
		// if we're just given e.g. a bare number, assume it's seconds
		if (!timestamp.includes(':')) {
			timestamp = `00:00:${timestamp.padStart(2, '0')}`;
		}
		if (timestamp.split(':').length === 2) {
			timestamp = `${timestamp}:00`;
		}
		const [hours, minutes, seconds] = timestamp.split(':');

		const s = +(seconds || '0') % 60;
		const m = (+(minutes || '0') % 60) + Math.floor(+(seconds || '0') / 60);
		const h = +(hours || '0') + Math.floor(m / 60);

		return `${h.toString().padStart(2, '0')}:${(m % 60)
			.toString()
			.padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
	};

	function timestampToSeconds(timestamp: string) {
        timestamp = normalizeTimestamp(timestamp);
		const [hours, minutes, seconds] = timestamp.split(':');
		return (
			Number.parseInt(hours || '0') * 3600 +
			Number.parseInt(minutes || '0') * 60 +
			Number.parseInt(seconds || '0')
		);
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class=" -translate-y-[33vh]">
		<Dialog.Header>
			<Dialog.Title>Add Annotation</Dialog.Title>
			<Dialog.Description>Add an annotation to this movie</Dialog.Description>
		</Dialog.Header>
		<AddAnnotationForm bind:editor bind:timestamp bind:title bind:tags />
		<Dialog.Footer>
			<Button
				on:click={() => {
					const contentData = editor.getJSON();
                    const obj = {
						contentData,
						entryId,
						tags: tags.map(({ id }) => id),
						target: {
							selector: {
								conformsTo: 'http://www.w3.org/TR/media-frags/',
								type: 'FragmentSelector',
								value: `t=${timestampToSeconds(timestamp)}`,
							},
							source: '',
						},
						title,
						type: 'annotation',
					};
                    console.log({obj})
					$mutation.mutate({
						contentData,
						entryId,
						tags: tags.map(({ id }) => id),
						target: {
							selector: {
								conformsTo: 'http://www.w3.org/TR/media-frags/',
								type: 'FragmentSelector',
								value: `t=${timestampToSeconds(timestamp)}`,
							},
							source: '',
						},
						title,
						type: 'annotation',
					});
				}}>Save</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
