<script lang="ts">
	import GenericInput from "$lib/components/GenericInput.svelte";
	import IconPicker from "$lib/components/IconPicker.svelte";
	import TipTap from "$lib/components/TipTap.svelte";
    let title = '';
</script>

<div class="mx-auto mt-16 mb-8 flex max-w-prose w-full  flex-col gap-2">
    <!-- {annotation.createdAt} -->
    <!-- collections: {JSON.stringify(annotation.collections)} -->
    <div class="flex flex-col gap-2">
        <div class="h-12 w-12 shrink-0 text-xl">
            <IconPicker
                on:choose={({ detail: chosenIcon }) => {
                    console.log({ chosenIcon });
                    // $updateAnnotationMutation.mutate({
                    //     id: annotation.id,
                    //     chosenIcon,
                    // });
                }}
                iconClass="h-6 w-6 fill-current "
            />
        </div>
        <GenericInput
            placeholder="Untitled"
            class="text-3xl font-semibold md:text-4xl"
            variant="naked"
            bind:value={title}
            on:blur={(e) => {
                // $updateAnnotationMutation.mutate({
                //     title: value,
                //     id: annotation.id,
                // });
            }}
        />
    </div>
    <div class="border-t border-border" />
    <div class="flex items-center space-x-4 text-sm text-muted">
        <div>
            <!-- Created on {dayjs(annotation.createdAt).format("LL")} -->
        </div>
        <div>
            <!-- Last edited {$updatedAt} -->
        </div>
        <!-- TODO: entry and collection -->
        <!-- {#if annotation.collections?.length}
            <Cluster class="gap-x-4 gap-y-2">
                {#each annotation.collections as { collection }}
                    <li class="rounded bg-elevation py-1 px-2 ring-1 ring-border/50">
                        <a
                            class="flex items-center gap-1"
                            href="/u:{collection.user?.username || $page.data.user?.username}/collection/{collection.id}"
                        >
                            <ChosenIcon chosenIcon={collection.icon} />
                            <span>{collection.name}</span>
                        </a>
                    </li>
                {/each}
            </Cluster>
        {/if} -->
    </div>
    <!-- TODO: textarea with markdown if no js -->
    <TipTap
        on:blur={({ detail: contentData }) =>{
            // $updateAnnotationMutation.mutate({ contentData, id: annotation.id })}
        }}
        class="!max-w-none"
    />
</div>
