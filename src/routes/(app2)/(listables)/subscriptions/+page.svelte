<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import rover from '$lib/actions/rover';
	import { Skeleton } from '$components/ui/skeleton';
	import { queryFactory } from '$lib/queries/querykeys';
	import Separator from '$components/ui/Separator.svelte';
	import { getHostname } from '$lib/utils';
	import { Badge } from '$components/ui/badge';

	export let data;
	const query = createQuery(queryFactory.subscriptions.all());
</script>

{#if $query.isLoading}
	<div class="mt-4 flex flex-col space-y-4">
		{#each Array(10) as _}
			<div>
				<Skeleton class="h-7 w-1/4" />
				<Skeleton class="mt-1 h-7 w-1/2" />
			</div>
		{/each}
	</div>
{:else if $query.isSuccess}
	<ul use:rover class="mt-4 space-y-4">
		{#each $query.data as subscription}
			{@const hostname = getHostname(subscription.link || subscription.feedUrl)}
			<!-- {hostname} -->
			<li class="flex px-4 justify-between items-center gap-x-4">
				<div class="flex items-center gap-x-4">
					<img
						src={(subscription.imageUrl &&
							!subscription.imageUrl.startsWith('http') &&
							data.S3_BUCKET_PREFIX + subscription.imageUrl) ||
							subscription.imageUrl ||
							`https://icon.horse/icon/${hostname}`}
						class="aspect-square h-8 rounded-md object-cover"
						alt=""
					/>
					<a href="/subscription/{subscription.feedId}">{subscription.title}</a>
				</div>
				<div>
					{#if Number(subscription.unreadCount)}
						<Badge variant="secondary">{subscription.unreadCount}</Badge>
					{/if}
				</div>
			</li>
			<Separator />
		{/each}
	</ul>
{/if}
