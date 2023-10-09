<script lang="ts">
	import { enhance } from '$app/forms';
	import { useQueryClient } from '@tanstack/svelte-query';
	import StarRating from './star-rating.svelte';
	import { invalidateEntries } from '$lib/queries/mutations';
	import { cn } from '$lib/utils';

	export let rating = 0;
	export let entryId: number | undefined = undefined;

	const queryClient = useQueryClient();
	let className: string | null | undefined = undefined;
	export { className as class };
</script>

<!-- TODO: shuold only be used on detail page, but make work anywhere -->
<form
	method="post"
	action="?/rate"
	use:enhance={() => {
		console.log('submitting');
		return async ({ result, update }) => {
			console.log({ result });
			if (result.type !== 'success') {
				update();
			} else {
				if (result.data?.created) {
					console.log(`Invalidating entries`);
					invalidateEntries(queryClient);
					update();
				}
			}
		};
	}}
>
	{#if entryId}
		<input type="hidden" name="entryId" value={entryId} />
	{/if}
	<StarRating class={cn('h-5 w-5', className)} {rating} />
</form>
