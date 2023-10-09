<script lang="ts">
	import { page } from "$app/stores";
	import Icon from "$lib/components/helpers/Icon.svelte";


	export let entry: {
		screenshot: string | null;
		title: string | null;
		published?: string | Date | null;
		uri: string | null;
        bookmark: {
            id: number;
        };
        id: number;
	};
    const getScreenshot = trpc($page).bookmarks.screenshot.createMutation({
        onSuccess: (screenshot) => {
            if (screenshot) {
                entry.screenshot = screenshot;
            }
        }
    });
    $: if (!entry.screenshot) {
        console.log("mutating - getting screenshot")
        $getScreenshot.mutate({
            id: entry.bookmark.id
        });
    }
</script>
<div class="flex container mx-auto flex-col object-cover rounded overflow-hidden border-border shadow bookmark ">
	<div class="flex gap-4 bg-border/50 py-2 px-4 text-muted border-border border-b">
		<Icon name="linkMini" className="h-4 w-4 fill-current" />
		<a class="text-muted/75 underline" href={entry.uri}>{entry.uri}</a>
	</div>
    {#if entry.screenshot}
	<img class="object-cover" src="https://pub-281a7c9dc6e94f59acee8afd0e4d4a80.r2.dev/{entry.screenshot}" alt="" />
    {:else if $getScreenshot.isLoading}
    <div class="flex justify-center items-center h-40">
        <Icon name="loading" className="h-8 w-8 animate-spin" />
    </div>
    {/if}
</div>

<style lang="postcss">
    .bookmark {
        max-height: calc(100vh - 100px);
    }
</style>
