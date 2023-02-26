<script lang="ts">
	import { page } from "$app/stores";
	import dayjs from "$lib/dayjs";
	import { modals } from "$lib/stores/modals";
	import { trpcWithQuery } from "$lib/trpc/client";
	import RichAnnotationInput from "./RichAnnotationInput.svelte";

	export let timestamp: number | undefined = undefined;
    export let entryId: number | undefined = undefined;
    export let source = '';

    const utils = trpcWithQuery($page).createContext();

    const saveAnnotation = trpcWithQuery().annotations.save.createMutation({
        onSuccess: () => {
           if (entryId) utils.entries.load.invalidate({
                id: entryId
            })
        }
    });

</script>

<RichAnnotationInput on:cancel={() => modals.close()} on:save={({detail: { value: contentData}}) => {
    // save
    $saveAnnotation.mutate({
        entryId,
        contentData,
        target: {
            source,
            selector: {
                type: "FragmentSelector",
                value: `t=${timestamp}`
            }
        }
    });
    modals.close();
}}>
	<svelte:fragment slot="top">
		{#if timestamp}
			<div class="px-3">
				<!-- todo: ability to change this -->
				<div class="max-w-min rounded bg-border px-3 py-1 text-xs tabular-nums">
					{dayjs.duration(timestamp, "s").format("mm:ss")}
				</div>
			</div>
		{/if}
	</svelte:fragment>
</RichAnnotationInput>
