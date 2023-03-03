<script lang="ts">
	import { page } from "$app/stores";
	import Button from "$lib/components/Button.svelte";
	import GenericInput from "$lib/components/GenericInput.svelte";
	import TagInputCombobox from "$lib/components/TagInputCombobox.svelte";
	import { trpcWithQuery } from "$lib/trpc/client";
	import type { Subscription } from "@prisma/client";
	export let subscription: Subscription & {
        tags: {
            id?: number;
            name: string;
        }[];
    };
	const client = trpcWithQuery($page);
	const updateSubscription = client.subscriptions.update.createMutation();
    let tags: {
        id?: number;
        name: string;
    }[] = [];
    $: console.log({tags})
</script>

<form on:submit|preventDefault={() => {
    $updateSubscription.mutate({
        id: subscription.id,
        data: {
            title: subscription.title,
            tags: subscription.tags
        }
    })
}}>
	<div class="flex flex-col">
		<GenericInput name="title" bind:value={subscription.title} />
	</div>
    {JSON.stringify(subscription)}
	<TagInputCombobox bind:tags={subscription.tags} submitOnBlur={false} />
	<Button type="submit">Submit</Button>
</form>
