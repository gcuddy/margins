<script lang="ts">
	import { page } from "$app/stores";
	import dayjs from "$lib/dayjs";
	import { modals } from "$lib/stores/modals";
	import { trpc } from "$lib/trpc/client";
	import RichAnnotationInput from "./RichAnnotationInput.svelte";

	export let timestamp: number | undefined = undefined;
    export let entryId: number | undefined = undefined;
    export let source = '';

    const utils = trpc($page).createContext();

    const saveAnnotation = trpc().annotations.save.createMutation({
        onMutate: (data) => {
           // TODO update
        },
        onSuccess: (data) => {
            console.log({entryId})
            utils.annotations.invalidate();
console.log({data, entryId})
           if (entryId) {
            utils.entries.load.setData({
                id: entryId
            }, old => {
                if (!old) return old;
                return {
                    ...old,
                    annotations: [...old.annotations, {
                        ...data,
                        creator: {
                            username: $page.data.user?.username || ''
                        },
                        children: []
                    }]
                }
            })
            // utils.entries.load.invalidate({
            //     id: entryId
            // })
           }
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
