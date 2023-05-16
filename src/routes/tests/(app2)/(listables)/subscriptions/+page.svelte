<script lang="ts">
	import rover from '$lib/actions/rover';
	import Skeleton from '$lib/components/ui/skeleton/Skeleton.svelte';

	export let data;
	$: query = data.query();
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
			<li class="flex items-center gap-x-4">
				<img
					src={(subscription.imageUrl &&
						!subscription.imageUrl.startsWith('http') &&
						data.S3_BUCKET_PREFIX + subscription.imageUrl) ||
						subscription.imageUrl ||
						`https://icon.horse/icon?uri=${subscription.feedUrl}`}
					class="aspect-square h-12 rounded-md object-cover"
					alt=""
				/>
				<a href="/tests/subscription/{subscription.feedId}">{subscription.title}</a>
			</li>
		{/each}
	</ul>
{/if}
