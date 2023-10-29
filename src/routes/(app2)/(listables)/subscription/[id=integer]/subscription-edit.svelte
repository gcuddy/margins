<script lang="ts">
	import { TagColorPill } from '$components/tags/tag-color';
	import { TagsCommandPopover } from '$components/tags/tag-command';
	import { Badge } from '$components/ui/badge';
	import { Button } from '$components/ui/button';
	import { DialogFooter } from '$components/ui/dialog';
	import { Input } from '$components/ui/input';
	import { Label } from '$components/ui/label';
	import type { Subscription } from '$lib/db/queries/subscriptions';
	import { cmdOrCtrl } from '$lib/helpers';
	import { type QueryOutput, mutate } from '$lib/queries/query';
	import { melt } from '@melt-ui/svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { Loader } from 'lucide-svelte';

	export let subscription: Subscription;
	export let open = false;

	const queryClient = useQueryClient();

	const mutation = createMutation({
		mutationFn: async (input) =>
			mutate('subscriptionUpdate', {
				id: subscription.subscriptionId,
				data: {
					title: subscription.title,
					tagIds: subscription.tags.map((t) => t.id),
				},
			}),
        onMutate() {
            // can't for the life of me figure out why this isn't working...
            queryClient.setQueryData(['subscriptions', subscription.feedId], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    feed: {
                        ...old.feed,
                        title: subscription.title,
                    }
                }
            })
        },
		onSettled() {
			open = false;
			queryClient.invalidateQueries({
				queryKey: ['subscriptions'],
			});
		},
	});
</script>

<Label for="title">Name</Label>
<Input
	on:keydown={(e) => {
		// handle enter (would wrap in form but then enter would also submit commandinput)
		if (e.key === 'Enter' && cmdOrCtrl(e)) {
			e.preventDefault();
			$mutation.mutate();
		}
	}}
	id="title"
	name="title"
	bind:value={subscription.title}
/>
<div>
	<TagsCommandPopover bind:selectedTags={subscription.tags} let:builder>
		<div class="flex flex-wrap gap-1" use:melt={builder}>
			{#each subscription.tags as tag}
				<!-- as="a" href="/tag/{tag.name}" to decide: should tehse be links or trigger popover? -->
				<Badge>
					<TagColorPill
						invertDefault
						class="mr-1.5 h-2 w-2"
						color={tag.color}
					/>
					{tag.name}
				</Badge>
			{:else}
				+ Tag
			{/each}
		</div>
	</TagsCommandPopover>
</div>
<!-- DialogFooter -->
<DialogFooter>
	<Button
		disabled={$mutation.isPending}
		variant="outline"
		on:click={() => (open = false)}>Cancel</Button
	>
	<Button
		disabled={$mutation.isPending}
		on:click={() => {
			$mutation.mutate();
		}}
		>Save {#if $mutation.isPending}
			<Loader class="ml-2 h-4 w-4 animate-spin" />
		{/if}</Button
	>
</DialogFooter>
