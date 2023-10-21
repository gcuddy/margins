<script lang="ts">
	import * as Popover from '$components/ui/popover';
	import { cn } from '$lib';
	import {
		BookIcon,
		CircleIcon,
		ClockIcon,
		FileIcon,
		FilterIcon,
		GlobeIcon,
		PaletteIcon,
		RssIcon,
		StarIcon,
		TagIcon,
		TypeIcon,
		UserIcon,
	} from 'lucide-svelte';
	import { type ButtonProps, buttonVariants } from '../button';

	import { page } from '$app/stores';
	import { entryTypeIcon } from '$components/entries/icons';
	import { TagsCommandItems } from '$components/tags/tag-command';
	import {
		Command,
		CommandGroup,
		CommandIcon,
		CommandInput,
		CommandItem,
		CommandList,
	} from '$components/ui/command2';
	import { types } from '$lib/types';
	import { createPageData } from '../command2/utils';
	import { ctx } from './ctx';
	import { statusesWithIcons } from '$lib/status';
	import { objectEntries } from '$lib/helpers';
	import { Authors, Rating, Subscriptions } from '$lib/commands';
	import { colors } from '$components/tags/tag-color';
	import PopoverDialog from '$components/popover-dialog.svelte';

	const filterPageData = createPageData([
		{
			icon: FileIcon,
			name: 'Type',
			placeholder: 'Filter by type...',
		},
		{
			icon: TagIcon,
			name: 'Tags',
			placeholder: 'Filter by tag...',
			shouldFilter: false,
		},
		{
			icon: UserIcon,
			name: 'Author',
			placeholder: 'Filter by author...',
			shouldFilter: false,
		},
		{
			icon: ClockIcon,
			name: 'Reading Time',
			placeholder: 'Filter by reading time...',
		},
		{
			action: () => {
				open = false;
				dialogStore.open({
					action(val) {
						filterChange($page.url, (data) => {
							data.domain = val;
							return data;
						});
					},
					title: 'Filter by domain',
					value: '',
				});
			},
			icon: GlobeIcon,
			name: 'Domain',
		},
		{
			action: () => {
				open = false;
				dialogStore.open({
					action(val) {
						filterChange($page.url, (data) => {
							console.log({ data });
							data.title = {
								contains: val,
							};
							return data;
						});
					},
					title: 'Filter by title',
					value: '',
				});
			},
			icon: TypeIcon,
			name: 'Title',
		},
		{
			icon: BookIcon,
			name: 'Book Genre',
			placeholder: 'Choose genre…',
		},
		// TODO: don't show if in status already
		{
			name: 'Status',
			icon: CircleIcon,
			placeholder: 'Filter by status…',
		},
		// TODO: don't show if in feed alrea
		{
			name: 'Subscription',
			icon: RssIcon,
			placeholder: 'Filter by feed…',
		},
		{
			name: 'Tag Color',
			icon: PaletteIcon,
			placeholder: 'Filter by tag color...',
		},
		{
			name: 'Rating',
			icon: StarIcon,
			placeholder: 'Filter by rating...',
		},
	]);

	export let open = false;

	$: console.log({ open, $openStore });

	$: if (open !== undefined) {
		openStore.set(open);
	}

	let className: string | null | undefined = undefined;
	export { className as class };

	const {
		helpers: { filterChange, navigateSearch },
		state: { dialogStore, open: openStore },
	} = ctx.get();

	export let size: ButtonProps['size'] = 'sm';
	export let variant: ButtonProps['variant'] = 'outline';
</script>

<Popover.Root
	bind:open
	positioning={{
		placement: 'bottom-start',
	}}
>
	<Popover.Trigger class={cn(buttonVariants({ variant, size }), className)}>
		<slot>
			<FilterIcon class="lg:mr-2 h-4 w-4" />
			<span class="lg:inline hidden">Filter</span>
		</slot>
	</Popover.Trigger>
    <PopoverDialog class="w-[200px] p-0" bind:open>
	<!-- <Popover.Content class="w-[200px] p-0"> -->
		<Command
			pages={filterPageData}
			let:pages
			let:page={currentPage}
			let:createPageItems
		>
			<CommandInput
				onKeydown={pages.handlers.keydown}
				placeholder="Filter..."
			/>
			<CommandList>
				<CommandGroup>
					{#if !currentPage}
						{@const filterTypes = createPageItems()}
						{#each filterTypes as { addPage, icon, name }}
							<CommandItem containsPages onSelect={addPage}>
								<CommandIcon {icon} />
								<span>{name}</span>
							</CommandItem>
						{/each}
					{:else if currentPage.name === 'Type'}
						{#each types as type}
							<CommandItem
								onSelect={() => {
									filterChange($page.url, (data) => {
										data.type = data.type ? undefined : type;
										return data;
									});
									open = false;
								}}
							>
								<CommandIcon icon={entryTypeIcon[type]} />
								{type}
							</CommandItem>
						{/each}
					{:else if currentPage.name === 'Tags'}
						<TagsCommandItems
							onSelect={(tag) => {
								filterChange($page.url, (data) => {
									console.log({ data, tag });
									console.log(tag.id);
									const test = { ...data };

									if (test.tags) {
										console.log('test.tags exists');
										if (test.tags.ids.includes(tag.id)) {
											test.tags.ids = test.tags.ids.filter((t) => t !== tag.id);
										} else {
											test.tags.ids.push(tag.id);
										}
									} else {
										console.log('test.tags does not exist');
										test.tags = {
											ids: [tag.id],
										};
									}

									return test;
									// if (data.tags) {
									//     console.log('data.tags exists')
									//     if (data.tags.ids.includes(tag.id)) {
									//         data.tags.ids = data.tags.ids.filter((t) => t !== tag.id)
									//     } else {
									//         data.tags.ids.push(tag.id)
									//     }
									// } else {
									//     console.log('data.tags does not exist')
									//     data.tags = {
									//         ids: [tag.id]
									//     }
									// }
									// data.tags = data.tags?.ids.includes(tag.id)
									// 	? {
									// 			...data.tags,
									// 			ids: data.tags.ids.filter((t) => t !== tag.id),
									// 	  }
									// 	: {
									// 			ids: [...(data.tags?.ids ?? []), tag.id],
									// 	  };
									// console.log([...data.tags.ids])
									return data;
								});
								open = false;
							}}
						/>
					{:else if currentPage.name === 'Reading Time'}
						{#each [{ name: '5 Minutes', time: 5 }, { name: '15 Minutes', time: 15 }, { name: '30 Minutes', time: 30 }, { name: '1 Hour', time: 60 }] as { name, time }}
							<CommandItem
								onSelect={() => {
									filterChange($page.url, (data) => {
										data.readingTime = {
											max: time,
										};
										return data;
									});
									open = false;
								}}>{name}</CommandItem
							>
						{/each}
						<!-- TODO: Custom -->
					{:else if currentPage.name === 'Book Genre'}
						<CommandItem
							onSelect={() => {
								filterChange($page.url, (data) => {
									data.book_genre = 'Fiction';
									return data;
								});
								open = false;
							}}>Fiction</CommandItem
						>
						<CommandItem
							onSelect={() => {
								filterChange($page.url, (data) => {
									data.book_genre = 'NonFiction';
									return data;
								});
								open = false;
							}}>NonFiction</CommandItem
						>
					{:else if currentPage.name === 'Author'}
						<Authors
							onSelect={(author) => {
								console.log({ author });
								filterChange($page.url, (data) => ({
									...data,
									author,
								}));
								open = false;
							}}
						/>
					{:else if currentPage.name === 'Status'}
						{#each objectEntries(statusesWithIcons) as [name, icon]}
							<CommandItem
								value={name}
								onSelect={(status) => {
									if (status) {
										navigateSearch((data) => ({
											...data,
											status,
										}));
									}
									open = false;
								}}
							>
								<CommandIcon {icon} />
								{name}
							</CommandItem>
						{/each}
					{:else if currentPage.name === 'Subscription'}
						<!-- subscriptions -->
						<Subscriptions
							onSelect={(subscription) => {
								if (subscription) {
									navigateSearch((data) => ({
										...data,
										feed: {
											in: [subscription.feedId],
										},
									}));
								}
								open = false;
							}}
						/>
					{:else if currentPage.name === 'Tag Color'}
						{#each colors as { value, label }}
							<CommandItem
								value={label}
								onSelect={(color) => {
									if (color) {
										const hex = colors.find(
											({ label }) => label === color,
										)?.value;
										if (hex) {
											navigateSearch((data) => ({
												...data,
												tagColor: {
													in: [hex],
												},
											}));
										}
									}
								}}
							>
								<div
									class="h-5 w-5 rounded-full"
									style:background-color={value}
								/>
								<span class="ml-2">{label}</span>
							</CommandItem>
						{/each}
					{:else if currentPage.name === 'Rating'}
						<Rating
							onSelect={(val) => {
								if (val === 'unrated') {
									navigateSearch((data) => ({
										...data,
										rating: 'unrated',
									}));
								} else if (val) {
									navigateSearch((data) => ({
										...data,
										rating: {
											gte: val,
										},
									}));
								}
							}}
						/>
					{/if}
				</CommandGroup>
			</CommandList>
		</Command>
	</PopoverDialog>
	<!-- </Popover.Content> -->
</Popover.Root>
