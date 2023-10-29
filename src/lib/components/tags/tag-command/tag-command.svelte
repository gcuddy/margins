<script lang="ts">
	import { type ComponentProps, createEventDispatcher, onMount } from 'svelte';
	import { writable } from 'svelte/store';

	import * as Command from '$components/ui/command2';
	import {
		createSetTagsMutation,
		createTagMutation,
		updateAnnotationMutation,
	} from '$lib/queries/mutations/index';

	import TagCommandItems from './tag-command-items.svelte';

	type Tag = { color: string; id: number; name: string };
	type OurProps = {
		annotationId?: string;
		autofocus?: boolean;
		entryId?: number | Array<number>;
		open?: boolean;
		shouldMutate?: boolean;
	};
	type $$Props = ComponentProps<TagCommandItems> & OurProps;

	export let annotationId: $$Props['annotationId'] = undefined;
	export let entryId: $$Props['entryId'] = undefined;
	export let open = false;
	export let selectedTags: Array<Tag> = [];
	export let shouldMutate = true;
	export let autofocus = true;
	export let multiple = true;
	let className = '';
	export { className as class };

	const selectedTagsStore = writable(selectedTags.map((value) => ({value})));
	const entryMutation = createSetTagsMutation();
	const annotationMutation = updateAnnotationMutation();
	const tagMutation = createTagMutation();
	const dispatch = createEventDispatcher<{
        close: void;
        select: { tag: Tag; selectedTags: Array<Tag> };
    }>();

	let commandInput: Command.Input;

	function handleSelect(tag: Tag) {
		selectedTags = selectedTags.some((t) => t.id === tag.id)
			? selectedTags.filter((t) => t.id !== tag.id)
			: [...selectedTags, tag];

        dispatch('select', { tag, selectedTags })
	}

	// $: if (selectedTags !== undefined) {
	// 	selectedTagsStore.set(selectedTags);
	// }

    $: console.log({$selectedTagsStore});

	onMount(() => {
		if (autofocus) {
			setTimeout(() => {
				commandInput?.focus();
			}, 400);
		}
	});

</script>

<Command.Root
	{multiple}
	class={className}
	selectedValue={selectedTagsStore}
	shouldFilter={writable(false)}
	onClose={async (tag, el, val) => {
		if (shouldMutate) {
			if (el?.id === 'shadow-new-tag') {
				const { id } = await $tagMutation.mutateAsync({
					name: val,
					// todo: random color
				});
				selectedTags = [...selectedTags, { color: '#000', id, name: val }];
			}
			if (entryId) {
				// do
				$entryMutation.mutate({
					entries: Array.isArray(entryId) ? entryId : [entryId],
					tags: selectedTags,
				});
			}
			if (annotationId) {
				// mutate
				$annotationMutation.mutate({
					id: annotationId,
					tags: selectedTags.map((tag) => tag.id),
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
