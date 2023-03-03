<script lang="ts">
	function isAnnotation(item: ArticleInList | Annotation): item is Annotation {
		return (item as Annotation).target !== undefined;
	}

	const dispatch$1 = createEventDispatcher<{
		update: {
			articles: ArticleInList[];
		};
		action: void;
	}>();
	const dispatch = () => dispatch$1('update', { articles: selected_items });

	const move = () => {
		commandPaletteStore.open({
			values: LOCATION_LIST,
			placeholder: 'Move to…',
			itemIcon: (val, active) => {
				console.log({ val });
				return {
					component: Icon,
					props: {
						name: LOCATION_TO_ICON_OUTLINE[val.id],
						className: `h-5 w-5 stroke-2 stroke-current ${
							active && 'dark:stroke-primary-100 stroke-primary-900'
						}`,
					},
				};
			},
			onSelect: async ({ detail }) => {
				const id = syncStore.add();
				// optimistic update
				selected_items = selected_items.map((article) => ({
					...article,
					location: detail.id,
				}));

				console.log({ selected_articles: selected_items });
				dispatch();
				await bulkEditArticles(ids, {
					location: detail.id,
				});
				await invalidateAll();
				notifications.notify({
					message: `Moved ${selected_items.length} articles to ${detail.name}`,
					title: `Moved to ${detail.name}`,
					type: 'success',
				});
				clear();
				syncStore.remove(id);
			},
		});
	};
	const add_to_list = async () => {
		//todo: use cache
		const res = await fetch('/lists', {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
		const lists = await res.json();
		console.log({ lists });
		commandPaletteStore.open({
			values: lists,
			placeholder: 'Add to list…',
			itemIcon: (val, active) => {
				console.log({ val });
				return {
					component: Icon,
					props: {
						name: 'viewGrid',
						className: `h-5 w-5 stroke-2 stroke-current ${
							active && 'dark:stroke-primary-100 stroke-primary-900'
						}`,
					},
				};
			},
			onSelect: async ({ detail }) => {
				// optimistic update
				console.log({ detail });

				let annotationId = selected_items
					.filter((item) => isAnnotation(item))
					.map((annotation) => annotation.id);
				let articleId = selected_items
					.filter((item) => !isAnnotation(item))
					.map((article) => article.id);

				const res = await addToList(detail.id, {
					annotationId,
					articleId,
				});
				console.log({ res });
				if (res.ok) {
					notifications.notify({
						message: `Moved ${selected_items.length} articles to ${detail.name}`,
						title: `Moved to ${detail.name}`,
						type: 'success',
					});
					dispatch();
					clear();
				}
			},
		});
	};
	const _actions = {
		archive: true,
		tag: true,
		addToList: true,
		moveTo: true,
	};
	export let actions: Partial<typeof _actions> = _actions;
</script>

{#if actions.addToList}
	<Button
		variant="ghost"
		className="space-x-1 flex items-center lg:text-base"
		on:click={add_to_list}
		><Icon name="viewGridAdd" className="h-4 w-4 stroke-2 stroke-current" />
		<span>Add to List</span></Button
	>
{/if}
{#if actions.archive}
	<Button
		variant="ghost"
		className="space-x-2 flex items-center lg:text-base"
		on:click={async () => {
			await archive(ids, null, '/', true);
		}}
		><Icon name="archiveSolid" className="h-4 w-4 fill-current" />
		<span>Archive</span></Button
	>
{/if}
{#if actions.moveTo}
	<Button
		variant="transparent"
		className="space-x-1 flex items-center lg:text-base"
		on:click={move}
		tooltip={{
			text: 'Move to location',
			kbd: 'm',
		}}
		><Icon name="arrowSmRight" className="h-4 w-4 stroke-2 stroke-current" />
		<span>Move to…</span></Button
	>{/if}
{#if actions.tag}
	<Button variant="ghost" className="lg:text-base">Tag</Button>
{/if}
