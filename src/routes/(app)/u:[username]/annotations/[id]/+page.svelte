<script lang="ts">
	import { page } from "$app/stores";
	import GenericInput from "$lib/components/GenericInput.svelte";
	import TipTap from "$lib/components/TipTap.svelte";
	import { trpc, trpcWithQuery } from "$lib/trpc/client";
	import type { RouterInputs } from "$lib/trpc/router";
	import { createMutation } from "@tanstack/svelte-query";
	import dayjs from "$lib/dayjs";
	import type { PageData } from "./$types";
	import { createRelativeDateStore } from "$lib/stores/relativeDate";
	import Cluster from "$lib/components/helpers/Cluster.svelte";
	import ChosenIcon from "$lib/components/ChosenIcon.svelte";
	import IconPicker from "$lib/components/IconPicker.svelte";
	export let data: PageData;
	$: query = data.query();

	$: console.log({ $query });

	const client = trpcWithQuery($page);
	const utils = client.createContext();
	const updateAnnotationMutation = client.annotations.save.createMutation({
		onMutate: (updatedAnnotation) => {
			// optimistic update
			// cancel outgoing refetches (so they don't overwrite our optimistic update) --?
			// get snapshot of previous data
			const previous = utils.annotations.detail.getData({
				id: data.id,
			});
			// set data to new value for this query and any entries and colelctions this annotation is in
			utils.annotations.detail.setData(
				{
					id: data.id,
				},
				(old) => {
					if (!old) return old;
					return {
						...old,
						...updatedAnnotation,
					};
				}
			);
			if ($query.data?.collections?.length) {
				$query.data?.collections.forEach(({ collection }) => {
					utils.collections.detail.setData(
						{
							id: collection.id,
						},
						(old) => {
							if (!old) return old;
							return {
								...old,
								// TODO: nesting
								items: old.items.map((item) => {
									if (item.annotation?.id === data.id) {
										return {
											...item,
											annotation: {
												...item.annotation,
												...updatedAnnotation,
											},
										};
									}
									return item;
								}),
							};
						}
					);
				});
			}
            if ($query.data?.entryId) {
                utils.entries.load.setData({
                    id: $query.data?.entryId,
                }, old => {
                    if (!old) return old;
                    return {
                        ...old,
                        annotations: old.annotations.map(annotation => {
                            if (annotation.id === data.id) {
                                return {
                                    ...annotation,
                                    ...updatedAnnotation,
                                };
                            }
                            return annotation;
                        }),
                    };
                });
            }
			return { previous };
		},
		onSuccess: () => {
			if ($query.data?.collections?.length) {
				$query.data?.collections.forEach(({ collection }) => {
					utils.collections.detail.invalidate({
						id: collection.id,
					});
				});
			}
            if ($query.data?.entryId) {
                utils.entries.load.invalidate({
                    id: $query.data?.entryId,
                });
            }
			utils.annotations.invalidate();
		},
	});

	let x = createMutation({
		mutationFn: (input: RouterInputs["annotations"]["save"]) =>
			trpc($page).annotations.save.mutate({
				id: data.annotation.id,
				...input,
			}),
	});

	$: updatedAt = createRelativeDateStore($query.data?.updatedAt);
</script>

<!-- TODO: replicate header here and for article/entry -->

{#if $query.isSuccess && $query.data}
	{@const annotation = $query.data}
	<div class="mx-auto mt-16 mb-8 flex max-w-4xl  flex-col gap-2">
		<!-- {annotation.createdAt} -->
		<!-- collections: {JSON.stringify(annotation.collections)} -->
		<div class="flex flex-col gap-2">
			<div class="h-12 w-12 shrink-0 text-xl">
				<IconPicker
					chosenIcon={annotation.chosenIcon}
					on:choose={({ detail: chosenIcon }) => {
						console.log({ chosenIcon });
						$updateAnnotationMutation.mutate({
							id: annotation.id,
							chosenIcon,
						});
					}}
					iconClass="h-6 w-6 fill-current "
				/>
			</div>
			<GenericInput
				placeholder="Untitled"
				class="text-3xl font-semibold md:text-4xl"
				variant="naked"
				on:blur={(e) => {
					const value = e.target.value;
					$updateAnnotationMutation.mutate({
						title: value,
						id: annotation.id,
					});
				}}
				value={$query.data.title || ""}
			/>
		</div>
		<div class="border-t border-border" />
		<div class="flex items-center space-x-4 text-sm text-muted">
			<div>
				Created on {dayjs(annotation.createdAt).format("LL")}
			</div>
			<div>
				Last edited {$updatedAt}
			</div>
			<!-- TODO: entry and collection -->
			{#if annotation.collections?.length}
				<Cluster class="gap-x-4 gap-y-2">
					{#each annotation.collections as { collection }}
						<li class="rounded bg-elevation py-1 px-2 ring-1 ring-border/50">
							<a
								class="flex items-center gap-1"
								href="/u:{collection.user?.username || $page.data.user?.username}/collection/{collection.id}"
							>
								<!-- @ts-ignore -->
								<ChosenIcon chosenIcon={collection.icon} />
								<span>{collection.name}</span>
							</a>
						</li>
					{/each}
				</Cluster>
			{/if}
		</div>
		<!-- TODO: textarea with markdown if no js -->
		<TipTap
			on:blur={({ detail: contentData }) =>
				$updateAnnotationMutation.mutate({ contentData, id: annotation.id })}
			class="!max-w-none"
			config={{
				content: $query.data.contentData,
			}}
		/>
	</div>
{/if}
