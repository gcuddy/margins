<script lang="ts">
	import { page } from '$app/stores';
	import type { EntryInList } from '$lib/db/selects';
	import { mutation } from '$lib/queries/query';
	import { state, update_entry } from '$lib/state/entries';
	import { isStatus, statuses } from '$lib/status';
	import { groupBy } from '$lib/utils';
	import Kanban from './Kanban.svelte';
	import KanbanColumn from './KanbanColumn.svelte';
	import StatusIcon from './StatusIcon.svelte';
	import EntryContextMenu from './context-menu/EntryContextMenu.svelte';
	import EntryItem from './EntryItem.svelte';
	import { crossfade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import EntryImage from './EntryImage.svelte';
	import EntryIcon from './EntryIcon.svelte';
	import Intersector from '$components/Intersector.svelte';

	export let entries: EntryInList[];

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

	$: groupings = groupBy(entries, (item) => $state[item.id].status ?? item.status ?? 'Not saved');
	$: console.log({ groupings });

	$: console.log({ $state });

	// const { trigger, ...menu } = createContextMenu();

	// $: Object.entries(groupings).sort((a, b) => {
	//     const a_index = order.indexOf(a[0]);
	//     const b_index = order.indexOf(b[0]);
	//     return a_index - b_index;
	// })
</script>

<!-- TODO: context menu (using entry item) -->
<div class="overflow-hidden">
	<div class="flex overflow-x-scroll gap-4">
		<!-- TODO: other groupings -->
		{#each statuses as status}
			{@const items = entries.filter((item) => ($state[item.id]?.status ?? item.status) === status)}
			<div class="w-[350px] flex flex-col gap-y-2">
				<div class="flex gap-3 items-center">
					<StatusIcon {status} class="h-3.5 w-3.5 shrink-0" />
					<h2 class="text-2xl font-sans font-semibold leading-none tracking-tight">
						{status}
					</h2>
				</div>
				<KanbanColumn
					onDrop={(e) => {
						console.log(`ondrop`);
						console.log({ e });
						const { info, items: newItems } = e.detail;
						if (info.trigger === 'droppedIntoZone') {
							console.log(`dropped into zone`);
							const { id } = info;
							if (isStatus(status)) {
								console.log(`is status`);
                                if (status !== $state[id]?.status) {
                                    update_entry(+id, {
                                        status
                                    });
                                    mutation($page, 'update_status', {
                                        ids: [+id],
                                        status
                                    });
                                }
							} else {
								console.log(`is not status`);
								// update_entry(+id, {
								//     status: key
								// })
							}

							// console.log({key})
							// update_entry(+id, {
							//     status: key
							// })
							// update_entry.mutate({
							//     id: info.dragged.id,
							//     status: key
							// })
						}
					}}
					{items}
					let:item
				>
					{@const data = $state[item.id] || item}
					<!-- Cross-fade transitions (but should be disabled with dnd?) -->
					<!--  in:receive={{ key: data.id }} out:send={{ key: data.id }} -->
					<div>
						<EntryItem
							on:move={() => {
								// re-calculate entries
								// groupings = groupings;
							}}
							entry={item}
							view="kanban"
						>
							<div class="flex items-center gap-2">
								{#if data.image}
									<EntryImage class="h-6 w-6" image={data.image} type={data.type} />
								{/if}
								<div class="flex flex-col min-w-0">
									<span class="truncate">
										{data.title}
									</span>
                                    <EntryIcon class="h-3 w-3 text-muted-foreground"  type={data.type} />
									<!-- <span class="text-xs">
										{data.type}
									</span> -->
								</div>
							</div>
						</EntryItem>
						<!-- <EntryContextMenu {menu} entry={data} /> -->
					</div>
                    <svelte:fragment slot="end">
                        <Intersector cb={() => {
                            console.log(`intersected`);
                            // Inifnite scroll here
                        }} />
                    </svelte:fragment>
				</KanbanColumn>
				<!-- {#each items as item}
			<slot {item} />
		{/each} -->
			</div>
		{/each}
	</div>
</div>

<style>
	/* :global(#dnd-action-dragged-el > div) {
		@apply rotate-1 shadow-xl;
	} */
	/* .item::after {
		content: '';
		border-radius: 5px;
		position: absolute;
		z-index: -1;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
		opacity: 0;
		-webkit-transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
		transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
	}
    :global(#dnd-action-dragged-el .item:hover::after) {
        opacity: 1;
    } */
</style>
