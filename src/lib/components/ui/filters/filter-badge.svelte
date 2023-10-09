<script lang="ts">
	import { fade } from 'svelte/transition';

	import Checkbox from '../checkbox/checkbox.svelte';

	import { colors } from '$components/tags/tag-color';

	import { statusesWithIcons } from '$lib/status';

	import { objectEntries, objectKeys, omit } from '$lib/helpers';

	import {
		alternativeArrayCompartorToDisplay,
		arrayComparators,
		comparatorToDisplay,
		comparatorToIcon,
		intComparatorSchema,
		stringComparatorSchema,
	} from '$lib/schemas/inputs/comparators';

	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		filterLibrarySchema,
		type FilterLibrarySchema,
	} from '$lib/schemas/library';
	import {
		createChangeSearch,
		defaultStringifySearch,
		parseSearchWithSchema,
	} from '$lib/utils/search-params';

	import * as Popover from '$components/ui/popover';
	import * as Command from '$components/ui/command2';
	import { Authors, Rating } from '$lib/commands';

	import Badge, { badgeVariants } from '../Badge.svelte';
	import CreatedAt from './conditions/CreatedAt.svelte';
	import { ctx } from './ctx';

	import {
		CircleIcon,
		FileIcon,
		PaletteIcon,
		RssIcon,
		TypeIcon,
		UserIcon,
		XIcon,
	} from 'lucide-svelte';
	import BadgeSelect from './badge-select.svelte';
	import ReadingTime from './conditions/ReadingTime.svelte';
	import Tags from './conditions/Tags.svelte';
	import Type from './conditions/Type.svelte';
	import ConditionLayout from './helpers/ConditionLayout.svelte';
	import { cn } from '$lib/utils';
	import FilterItem from './filter-item.svelte';
	import FilterPopover from './filter-popover.svelte';
	import Select from './helpers/Select.svelte';
	import Feed from './conditions/feed.svelte';
	import TagColorPill from '$components/tags/tag-color/tag-color-pill.svelte';
	import Types from '$lib/commands/Types.svelte';
	import { entryTypeIcon } from '$components/entries/icons';

	type FilterKeys = keyof FilterLibrarySchema;

	type T = $$Generic<FilterKeys>;

	export let type: T;
	export let filter: FilterLibrarySchema[T];

	// TODO: these types are all messed up
	function getFilter<TKey extends keyof FilterLibrarySchema>(
		_type: TKey,
		_filter: typeof filter,
	) {
		return _filter as FilterLibrarySchema[TKey];
	}
	function getKeys<T extends object>(obj: T): Array<keyof T> {
		return Object.keys(obj) as Array<keyof T>;
	}

	const container = writable<HTMLElement | null>(null);
	setContext('filterContainer', container);

	const {
		helpers: { filterChange, navigateSearch },
		state: { dialogStore, filterStore },
	} = ctx.get();
</script>

<!-- Here lies dragons... -->
{#if type !== 'any'}
	<div bind:this={$container}>
		{#if type === 'createdAt'}
			<!-- filter should equal FilterLibrarySchema["createdAt"] -->
			{@const _f = getFilter('createdAt', filter)}
			{@const filters = Array.isArray(_f) ? _f : [_f]}
			{#each filters.filter(Boolean) as filter, idx}
				{@const key =
					'gte' in filter ? 'gte' : 'lte' in filter ? 'lte' : 'equals'}
				<CreatedAt
					on:delete={() => {
						console.log(`deleting`);
						const search = parseSearchWithSchema(
							$page.url.search,
							filterLibrarySchema,
						);
						const { createdAt } = search;
						const createdAts = [...filters];
						createdAts[idx] = undefined;
						const newSearch = {
							...search,
							createdAt: createdAts.filter(Boolean).length
								? createdAts
								: undefined,
						};
						for (const key in newSearch) {
							if (newSearch[key] === undefined) {
								delete newSearch[key];
							}
						}
						const newStr = defaultStringifySearch(newSearch);
						console.log({ createdAts, newSearch, newStr });
						const url = $page.url.pathname + newStr;
						goto(url, {
							keepFocus: true,
							noScroll: true,
							replaceState: true,
						});
					}}
					on:change={({ detail }) => {
						console.log({ detail });
						const search = parseSearchWithSchema(
							$page.url.search,
							filterLibrarySchema,
						);
						const { createdAt } = search;
						const createdAts = [...filters];
						createdAts[idx] = detail;
						// const createdAts = createdAt ? (Array.isArray(createdAt) ? createdAt : [createdAt]) : [];
						const newSearch = {
							...search,
							createdAt: createdAts,
						};
						console.log({ newSearch });
						const newStr = defaultStringifySearch(newSearch);
						const url = $page.url.pathname + newStr;
						goto(url, {
							keepFocus: true,
							noScroll: true,
							replaceState: true,
						});
					}}
					{filter}
				/>
			{/each}
		{:else if type === 'type' && filter}
			{@const type = getFilter('type', filter)}
			{#if type}
				<!-- <Type {type} /> -->
				{@const typeObj = typeof type === 'string' ? { in: [type] } : type}
				{#each objectEntries(typeObj) as [op, types]}
					{#if types}
						<FilterItem
							title="Type"
							icon={FileIcon}
							onDelete="type"
							key={typeof type === 'string' ? undefined : op}
						>
							<BadgeSelect
								slot="comparator"
								choices={arrayComparators.map((value) => ({
									value,
									label: alternativeArrayCompartorToDisplay[value],
									icon: comparatorToIcon[value],
								}))}
								selected={{
									label: alternativeArrayCompartorToDisplay[op],
									value: op,
								}}
								onSelectedChange={(value) => {
									if (value) {
										const newOp = value.value;
										navigateSearch((data) => {
											const existingType = data.type;
											if (!existingType) {
												return {
													...data,
													type: {
														[newOp]: types,
													},
												};
											}
											if (typeof existingType === 'string') {
												return {
													...data,
													type: {
														[newOp]: [existingType],
													},
												};
											}
											// const {[op]: previousValue, ...rest } = existingType;
											return {
												...data,
												type: {
													// This should work in this case, because we're switching between in/nin
													[newOp]: existingType[newOp]
														? Array.from(
																new Set([
																	...(existingType[newOp] ?? []),
																	...(types ?? []),
																]),
														  )
														: types,
												},
											};
										});
									}
								}}
							/>
							<svelte:fragment slot="value">
								<FilterPopover>
									<svelte:fragment slot="trigger">
										{#if types.length === 1 && types[0]}
											<svelte:component
												this={entryTypeIcon[types[0]]}
												class="h-3 w-3 mr-1"
											/>
											{types[0]}
										{:else}
											<div class="flex items-center -space-x-0.5">
												{#each types.slice(0, 3) as type}
													<svelte:component
														this={entryTypeIcon[type]}
														class="h-3 w-3 border border-background rounded"
													/>
												{/each}
												{types.length} types
											</div>
										{/if}
									</svelte:fragment>
									<svelte:fragment slot="commands" let:close>
										<Types
											onSelect={(type) => {
												navigateSearch((data) => {
													const existingType = data.type;
													if (!existingType) {
														return {
															...data,
															type: {
																[op]: [type],
															},
														};
													}
													if (typeof existingType === 'string') {
														if (existingType === type) {
															const { type, ...rest } = data;
															return rest;
														}
														return {
															...data,
															type: {
																[op]:
																	existingType === type
																		? []
																		: [existingType, type],
															},
														};
													}
													const existingOpType = existingType[op];
													const newOpType = existingOpType?.includes(type)
														? existingOpType.filter((t) => t !== type)
														: [...(existingOpType ?? []), type];
													if (newOpType.length === 0) {
														// then delete this
														const newType = omit(existingType, op);
														if (objectKeys(newType).length === 0) {
															const { type, ...rest } = data;
															return rest;
														}
														return {
															...data,
															type: newType,
														};
													}
													return {
														...data,
														type: {
															...existingType,
															[op]: newOpType,
														},
													};
												});
												close();
											}}
											multiple
											selected={types}
										/>
									</svelte:fragment>
								</FilterPopover>
							</svelte:fragment>
						</FilterItem>
					{/if}
				{/each}
			{/if}
		{:else if type === 'tags' && filter}
			{@const tags = getFilter('tags', filter)}
			{#if tags}
				<div class="flex flex-wrap">
					<Tags {...tags} />
				</div>
			{/if}
		{:else if type === 'readingTime'}
			{@const readingTime = getFilter('readingTime', filter)}
			{#if readingTime}
				<div class="flex flex-wrap">
					<ReadingTime {readingTime} />
				</div>
			{/if}
		{:else if type === 'title'}
			{@const title = getFilter('title', filter)}
			{#if title}
				{#each objectEntries(title) as [key, value]}
					<div class="flex h-6 min-w-0">
						<Badge
							variant="outline"
							class="rounded-r-none border-r-0 flex gap-1 pl-0"
						>
							<TypeIcon class="h-3 w-" />
							Title</Badge
						>
						<BadgeSelect
							class="rounded-none border"
							choices={objectKeys(
								omit(stringComparatorSchema.shape, 'in', 'nin', 'search'),
							).map((key) => ({
								label: comparatorToDisplay[key],
								value: key,
							}))}
							selected={{
								label: comparatorToDisplay[key],
								value: key,
							}}
							onSelectedChange={(val) => {
								filterChange($page.url, (data) => {
									if (data.title) {
										delete data.title[key];
										// TODO: fix
										data.title[val.value] = value;
									}
									console.log({ data });
									return data;
								});
							}}
						/>
						<Badge
							on:click={() => {
								if (typeof value === 'string') {
									dialogStore.open({
										action: (value) => {
											filterChange($page.url, (data) => {
												data.title[key] = value;
												console.log({ data });
												return data;
											});
										},
										title: 'Filter by title',
										value,
									});
								}
							}}
							variant="outline"
							class="rounded-none min-w-0 border-x-0 cursor-pointer max-w-[80px] truncate"
						>
							<span class="truncate">{value}</span>
						</Badge>
						<button
							on:click={() => {
								filterChange($page.url, (data) => {
									if (data.title) {
										delete data.title[key];
										console.log({ data });
										if (objectKeys(data.title).length === 0) {
											console.log('deleting title');
											delete data.title;
										}
									}
									console.log(`setting to`, { data });
									return data;
								});
							}}
							class={cn(
								badgeVariants({ variant: 'outline' }),
								'rounded-l-none',
							)}
						>
							<XIcon class="w-3 h-3" />
						</button>
					</div>
				{/each}
				<div class="flex">
					<!-- <Badge variant="outline" class="rounded-r-none border-r-0">"Title"</Badge>
                <Badge variant="outline" class="rounded-none border">{title}</Badge>
                <Badge variant="outline" class="rounded-r-none border-r-0">"Title"</Badge> -->
				</div>
			{/if}
		{:else if type === 'domain'}
			<!-- TODO: scope alert dialog into Filter so that we can set it from here with ctx -->
			<ConditionLayout
				name="Domain"
				on:delete={() => filterStore.delete('domain')}
			>
				<svelte:fragment slot="value">
					{filter}
				</svelte:fragment>
			</ConditionLayout>
		{:else if type === 'feed'}
			{@const feed = getFilter('feed', filter)}
			{#if feed}
				{#each objectEntries(feed) as [key, value]}
					{#if value}
						<FilterItem
							title="Subscription"
							icon={RssIcon}
							onDelete={() => {
								// TODO
								navigateSearch((data) => {
									const { feed, ...rest } = data;
									return rest;
								});
							}}
						>
							<BadgeSelect
								slot="comparator"
								choices={['in', 'nin'].map((value) => ({
									value,
									label: comparatorToDisplay[value],
								}))}
								selected={{
									label: comparatorToDisplay[key],
									value: key,
								}}
							></BadgeSelect>
							<Feed
								type={key}
								slot="value"
								id={Array.isArray(value) ? value : [value]}
							/>
							<!-- <svelte:fragment slot="value" let:c>
							<div class={c}>
							</div>
						</svelte:fragment> -->
						</FilterItem>
					{/if}
				{/each}
			{/if}
		{:else if type === 'author'}
			{@const author = getFilter('author', filter)}
			{#if author}
				<FilterItem
					title="Author"
					icon={UserIcon}
					comparator="is"
					onDelete={() => {
						navigateSearch((data) => {
							const { author, ...rest } = data;
							return rest;
						});
					}}
				>
					<svelte:fragment slot="value">
						<FilterPopover>
							<!-- <svelte:fragment slot="value">testest</svelte:fragment> -->
							<svelte:fragment slot="trigger">
								{author}
							</svelte:fragment>
							<svelte:fragment slot="commands" let:close>
								<Authors
									onSelect={(author) => {
										navigateSearch((data) => ({
											...data,
											author,
										}));
										close();
									}}
								/>
							</svelte:fragment>
						</FilterPopover>
					</svelte:fragment>
					<!--  -->
				</FilterItem>
			{/if}
		{:else if type === 'status'}
			{@const status = getFilter('status', filter)}
			<!-- TODO: handle other status cases -->
			{#if status && typeof status === 'string'}
				<FilterItem
					title="Status"
					icon={CircleIcon}
					value={typeof status === 'string' ? status : undefined}
					onDelete={() => {
						navigateSearch((data) => {
							const { status, ...rest } = data;
							return rest;
						});
					}}
				>
					<svelte:fragment slot="value">
						<Select
							choices={objectEntries(statusesWithIcons).map(
								([status, icon]) => ({
									label: status,
									value: status,
									icon,
								}),
							)}
							selected={{
								label: status,
								value: status,
							}}
							onSelectedChange={({ value }) => {
								navigateSearch((data) => ({
									...data,
									status: value,
								}));
							}}
						/>
					</svelte:fragment>
				</FilterItem>
			{/if}
		{:else if type === 'tagColor'}
			{@const tagColor = getFilter('tagColor', filter)}
			{#if tagColor}
				{#each objectEntries(tagColor) as [key, value]}
					<FilterItem
						title="Tag Color"
						icon={PaletteIcon}
						onDelete={() => {
							// todo
							navigateSearch((data) => {
								const { tagColor, ...rest } = data;

								if (tagColor) {
									const newTagColor = omit(tagColor, key);
									if (objectKeys(newTagColor).length === 0) {
										return rest;
									} else {
										rest.tagColor = newTagColor;
										return rest;
									}
								}

								return rest;
							});
						}}
					>
						<BadgeSelect
							slot="comparator"
							choices={['in', 'nin'].map((value) => ({
								value,
								label: comparatorToDisplay[value],
							}))}
							selected={{
								label: comparatorToDisplay[key],
								value: key,
							}}
						/>
						<svelte:fragment slot="value">
							<FilterPopover>
								<svelte:fragment slot="trigger">
									{#each value ?? [] as color (color)}
										<div transition:fade>
											<TagColorPill class="h-3 w-3" {color} />
										</div>
									{/each}
								</svelte:fragment>
								<svelte:fragment slot="commands" let:close>
									{#each colors as color}
										<Command.Item
											value={color.label}
											onSelect={(label) => {
												if (!label) return;
												const hex = colors.find(
													(c) => c.label === label,
												)?.value;
												if (hex) {
													const existing = value ?? [];
													const newColors = existing.includes(hex)
														? existing.filter((c) => c !== hex)
														: [...existing, hex];
													navigateSearch((data) => ({
														...data,
														tagColor: {
															...data.tagColor,
															[key]: newColors,
														},
													}));
													close();
												}
											}}
											let:isSelected
										>
											<Checkbox
												class="mr-2"
												checked={value?.includes(color.value)}
											/>
											<div
												class="h-5 w-5 rounded-full"
												style:background-color={color.value}
											/>
											<span class="ml-2">{color.label}</span>
										</Command.Item>
									{/each}
								</svelte:fragment>
							</FilterPopover>
						</svelte:fragment>
					</FilterItem>
				{/each}
			{/if}
		{:else if type === 'rating'}
			{@const rating = getFilter('rating', filter)}
			{#if rating}
				{#if typeof rating === 'string'}
					<FilterItem title="Rating" value="Unrated"></FilterItem>
				{:else}
					{#each objectEntries(rating) as [op, value]}
						<FilterItem onDelete="rating" title="Rating">
							<BadgeSelect
								slot="comparator"
								choices={objectKeys(
									omit(intComparatorSchema.shape, 'in', 'nin'),
								).map((value) => ({
									value,
									label: comparatorToDisplay[value],
								}))}
								selected={{
									label: comparatorToDisplay[op],
									value: op,
								}}
                                onSelectedChange={({value: newOp}) => {
                                    navigateSearch(data => {
                                        const previousRating = data.rating;
                                        if (!previousRating || typeof previousRating === "string") {
                                            // hopefully we're not here
                                            return data;
                                        }
                                        const { [op]: previousValue, ...rest } = previousRating;
                                        return {
                                            ...data,
                                            rating: {
                                                ...rest,
                                                [newOp]: previousValue,
                                            }
                                        }
                                    })
                                }}
							/>
							<FilterPopover slot="value">
								<svelte:fragment slot="trigger">
									{#each Array(value) as _}
										★
									{/each}
								</svelte:fragment>
								<Rating
									let:close
									slot="commands"
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
										close();
									}}
								/>
							</FilterPopover>
						</FilterItem>
					{/each}
				{/if}
			{/if}
		{/if}
	</div>
{/if}
