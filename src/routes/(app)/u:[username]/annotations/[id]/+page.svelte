<script lang="ts">
	import { page } from "$app/stores";
	import GenericInput from "$lib/components/GenericInput.svelte";
	import TipTap from "$lib/components/TipTap.svelte";
	import { trpc } from "$lib/trpc/client";
	import type { RouterInputs } from "$lib/trpc/router";
	import { createMutation } from "@tanstack/svelte-query";
	import dayjs from "$lib/dayjs";
	import type { PageData } from "./$types";
	import { createRelativeDateStore } from "$lib/stores/relativeDate";
	import Cluster from "$lib/components/helpers/Cluster.svelte";
	import ChosenIcon from "$lib/components/ChosenIcon.svelte";
	import IconPicker from "$lib/components/IconPicker.svelte";
	export let data: PageData;
	$: ({ annotation } = data);

	const updateAnnotationMutation = createMutation({
		mutationFn: (input: RouterInputs["annotations"]["save"]) =>
			trpc($page).annotations.save.mutate({
				id: data.annotation.id,
				...input,
			}),
	});

	$: updatedAt = createRelativeDateStore(annotation.updatedAt);
</script>

<!-- TODO: replicate header here and for article/entry -->
<div class="mx-auto mt-16 mb-8 flex max-w-4xl  flex-col gap-2">
	<!-- {annotation.createdAt} -->
	<!-- collections: {JSON.stringify(annotation.collections)} -->
	<div class="flex flex-col gap-2">
		<div class="h-12 w-12 shrink-0 text-xl">
			<IconPicker chosenIcon={annotation.chosenIcon} on:choose={({detail: chosenIcon}) => {
                console.log({chosenIcon})
                $updateAnnotationMutation.mutate({
                    chosenIcon
                });
            }} iconClass="h-6 w-6 fill-current " />
		</div>
		<GenericInput
			placeholder="Untitled"
			class="text-3xl font-semibold md:text-4xl"
			variant="naked"
			on:blur={(e) => {
				const value = e.target.value;
				$updateAnnotationMutation.mutate({
					title: value,
				});
			}}
			value={data.annotation.title || ""}
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
		on:blur={({ detail: contentData }) => $updateAnnotationMutation.mutate({ contentData })}
		class="!max-w-none"
		config={{
			content: data.annotation.contentData,
		}}
	/>
</div>
