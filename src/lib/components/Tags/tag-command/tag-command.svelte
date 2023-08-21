<script lang="ts">
	import TagCommandItems from './tag-command-items.svelte';
	import * as Command from '$components/ui/command2';
	import {
		createSetTagsMutation,
		updateAnnotationMutation,
		createTagMutation
	} from '$lib/queries/mutations/index';
	import { onMount, type ComponentProps, createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';

	type Tag = { id: number; name: string; color: string };
	type OurProps = {
		entryId?: number | number[];
		annotationId?: string;
		open?: boolean;
		shouldMutate?: boolean;
		autofocus?: boolean;
	};
	type $$Props = ComponentProps<TagCommandItems> & OurProps;

	export let annotationId: $$Props['annotationId'] = undefined;
	export let entryId: $$Props['entryId'] = undefined;
	export let open = false;
	export let selectedTags: Tag[] = [];
	export let shouldMutate = true;
	export let autofocus = true;
	let className = '';
	export { className as class };

	const selectedTagsStore = writable(selectedTags);
	const entryMutation = createSetTagsMutation();
	const annotationMutation = updateAnnotationMutation();
	const tagMutation = createTagMutation();
    const dispatch = createEventDispatcher();

	let commandInput: Command.Input;

	function handleSelect(tag: Tag) {
		if (selectedTags.some((t) => t.id === tag.id)) {
			selectedTags = selectedTags.filter((t) => t.id !== tag.id);
		} else {
			selectedTags = [...selectedTags, tag];
		}
	}

	$: selectedTags !== undefined && selectedTagsStore.set(selectedTags);

	onMount(() => {
		if (autofocus) {
			setTimeout(() => {
				commandInput?.focus();
			}, 400);
		}
	});
</script>

<Command.Root
	class={className}
	selectedValue={selectedTagsStore}
	shouldFilter={false}
	onClose={async (tag, el, val) => {
		if (shouldMutate) {
			if (el?.id === 'shadow-new-tag') {
				const { id } = await $tagMutation.mutateAsync({
					name: val
					// todo: random color
				});
				selectedTags = [...selectedTags, { id, name: val, color: '#000' }];
				console.log({ selectedTags });
			}
			if (entryId) {
				// do
				$entryMutation.mutate({
					entries: Array.isArray(entryId) ? entryId : [entryId],
					tags: selectedTags
				});
			}
			if (annotationId) {
				// mutate
				$annotationMutation.mutate({
					id: annotationId,
					tags: selectedTags.map((tag) => tag.id)
				});
			}
		}
		open = false;
        dispatch('close');
	}}
>
	<Command.Input bind:this={commandInput} autofocus placeholder="Add tags…" />
	<Command.List>
		<Command.Group>
			<!-- Command Items -->
			<TagCommandItems bind:selectedTags onSelect={handleSelect} />
		</Command.Group>
	</Command.List>
</Command.Root>
