<script lang="ts">
	import type { Relation } from '@prisma/client';
	import {
		ArrowLeft,
		ArrowLeftRight,
		ArrowRight,
		ArrowRightLeft,
		GroupIcon,
		MoreHorizontalIcon,
		TrashIcon,
	} from 'lucide-svelte';
	import type { ComponentType } from 'svelte';

	import { invalidate } from '$app/navigation';
	import type { ListEntry } from '$lib/db/selects';
	import { getId, getType } from '$lib/utils/entries';
	import { post } from '$lib/utils/forms';

	import { Badge } from '$components/ui/badge';
	import { melt } from '@melt-ui/svelte';
	import HoverEntry from './HoverEntry.svelte';
	import Button from './ui/Button.svelte';
	import NativeSelect from './ui/NativeSelect.svelte';
	import OptionsMenu from './ui/dropdown-menu/OptionsMenu.svelte';
	import * as HoverCard from './ui/hover-card';
	import { dialog_store } from './ui/singletons/Dialog.svelte';

	const icons: Record<Relation['type'], ComponentType> = {
		Grouped: GroupIcon,
		Related: ArrowRightLeft,
		SavedFrom: ArrowLeft,
	};

    function getIcon(): ComponentType {
        if (type === "SavedFrom" && direction === "inbound") {
            return ArrowLeft;
        } else if (type === "SavedFrom" && direction === "outbound") {
            return ArrowRight;
        } else {
            return icons[type];
        }
    }

	export let type: Relation['type'];
	export let id: Relation['id'];
    export let direction: "outbound" | "inbound" = "outbound";
	export let entry: ListEntry;
	const original_type = type;

	const on_type_change = (e: Event) => {
		const target = e.target as HTMLSelectElement;
		const value = target.value as Relation['type'];
		type = value;
	};
</script>

<HoverCard.Root>
	<HoverCard.Trigger asChild let:builder>
		<div use:melt={builder}>
			<Badge variant="outline" class="min-w-0 max-w-[200px] xl:max-w-[224px]">
				<svelte:component this={getIcon()} class="mr-2 h-4 w-4 shrink-0" />
				<a href="/{getType(entry.type)}/{getId(entry)}" class="truncate"
					>{entry.title}</a
				>
				<OptionsMenu
					placement="bottom-end"
					size="sm"
					variant="ghost"
					class="h-6 p-1"
					items={[
						[
							{
								icon: ArrowLeftRight,
								onSelect: () =>
									dialog_store.open({
										content: {
											component: NativeSelect,
											props: {
												onChange: on_type_change,
												options: ['Grouped', 'Related', 'SavedFrom'],
												value: type,
											},
										},
										footer: {
											component: Button,
											props: {
												onClick: () => {
													console.log('save');
													post(`/entry/${entry.id}?/update_relation`, {
														id,
														type,
													}).then((result) => {
														if (result.type !== 'success') {
															type = original_type;
														}
													});
													dialog_store.close();
												},
												text: 'Save',
											},
										},
										title: 'Edit type',
									}),
								text: 'Edit type',
							},
							{
								icon: TrashIcon,
								onSelect: () => {
									post(`/entry/${entry.id}?/relation`, { id }).then(() =>
										invalidate('entry'),
									);
								},
								text: 'Delete',
							},
						],
					]}
				>
					<MoreHorizontalIcon slot="trigger" class="h-4 w-4" />
				</OptionsMenu>
				<!-- <form use:enhance method="post" action="/entry/{entry.id}?/relation">
            <input type="hidden" name="id" value={id} />
            <button> x </button>
        </form> -->
			</Badge>
		</div>
	</HoverCard.Trigger>
	<HoverCard.Content>
		<HoverEntry id={entry.id} type={getType(entry.type)} />
	</HoverCard.Content>
</HoverCard.Root>
