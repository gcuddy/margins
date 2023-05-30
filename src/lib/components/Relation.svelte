<script lang="ts">
	import type { Entry, Relation } from '@prisma/client';
	import Badge from './ui/Badge.svelte';
	import type { ComponentType } from 'svelte';
	import {
		ArrowLeft,
		ArrowLeftRight,
		ArrowRightLeft,
		Edit3Icon,
		GroupIcon,
		MoreHorizontalIcon,
		TrashIcon
	} from 'lucide-svelte';
	import { getId, getType } from '$lib/utils/entries';
	import { enhance } from '$app/forms';
	import OptionsMenu from './ui/dropdown-menu/OptionsMenu.svelte';
	import { dialog_store } from './ui/singletons/Dialog.svelte';
	import NativeSelect from './ui/NativeSelect.svelte';
	import Button from './ui/Button.svelte';
	import { post } from '$lib/utils/forms';
	import { invalidate } from '$app/navigation';
	import HoverCard from './ui/hover-card/HoverCard.svelte';
	import HoverEntry from './HoverEntry.svelte';

	const icons: Record<Relation['type'], ComponentType> = {
		Related: ArrowRightLeft,
		SavedFrom: ArrowLeft,
		Grouped: GroupIcon
	};

	export let type: Relation['type'];
	export let id: Relation['id'];
	export let entry: Pick<
		Entry,
		'type' | 'id' | 'tmdbId' | 'googleBooksId' | 'spotifyId' | 'podcastIndexId' | 'title'
	>;
	let original_type = type;

	const on_type_change = (e: Event) => {
		const target = e.target as HTMLSelectElement;
		const value = target.value as Relation['type'];
		type = value;
	};
</script>

<HoverCard>
	<Badge slot="trigger" class="min-w-0 max-w-[200px] xl:max-w-[224px]">
		<svelte:component this={icons[type]} class="mr-2 h-4 w-4 shrink-0" />
		<a href="/tests/{getType(entry.type)}/{getId(entry)}" class="truncate">{entry.title}</a>
		<OptionsMenu
			placement="bottom-end"
			size="sm"
			variant="ghost"
			class="h-6 p-1"
			items={[
				[
					{
						text: 'Edit type',
						onSelect: () =>
							dialog_store.open({
								title: 'Edit type',
								content: {
									component: NativeSelect,
									props: {
										options: ['Grouped', 'Related', 'SavedFrom'],
										onChange: on_type_change,
										value: type
									}
								},
								footer: {
									component: Button,
									props: {
										text: 'Save',
										onClick: () => {
											console.log('save');
											post(`/tests/entry/${entry.id}?/update_relation`, { id, type }).then(
												(result) => {
													if (result.type !== 'success') {
														type = original_type;
													}
												}
											);
											dialog_store.close();
										}
									}
								}
							}),
						icon: ArrowLeftRight
					},
					{
						text: 'Delete',
						onSelect: () => {
							console.log('delete');
							post(`/tests/entry/${entry.id}?/relation`, { id }).then(() => invalidate('entry'));
						},
						icon: TrashIcon
					}
				]
			]}
		>
			<MoreHorizontalIcon slot="trigger" class="h-4 w-4" />
		</OptionsMenu>
		<!-- <form use:enhance method="post" action="/tests/entry/{entry.id}?/relation">
		<input type="hidden" name="id" value={id} />
		<button> x </button>
	</form> -->
	</Badge>
	<div slot="content">
		<HoverEntry id={entry.id} />
	</div>
</HoverCard>
