<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import Button from './ui/Button.svelte';
	import { PinIcon } from 'lucide-svelte';
	import { cn } from '$lib/utils/tailwind';
	import { useQueryClient } from '@tanstack/svelte-query';

	export let pin_id: string | null;

	let pinned: boolean;

	$: pinned = !!pin_id;

	export let action = '?/pin';

	const queryClient = useQueryClient();
</script>

<form
	use:enhance={() => {
		pinned = !pinned;
		return ({ update, result }) => {
			// update();
			queryClient.invalidateQueries({
				queryKey: ['pins']
			});
			if (result.type === 'success') {
				toast.success(pinned ? 'Pin added' : 'Pin removed', { duration: 2000 });
			}
		};
	}}
	method="post"
	{action}
>
	{#if pinned}
		<input type="hidden" name="pin_id" value={pin_id} />
	{/if}
	<slot />
	<Button variant="ghost" class="group">
		<PinIcon
			class={cn(
				'h-4 w-4 transition-transform group-hover:rotate-6',
				pinned && 'fill-accent-foreground'
			)}
		/>
		<span class="sr-only">{pinned ? 'Remove pin' : 'Pin'}</span>
	</Button>
</form>
