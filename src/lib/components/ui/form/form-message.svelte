<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Message } from '$lib/types/forms';
	export let message: Message | string | undefined | null = undefined;
	export let subtle = false;
</script>

{#if message}
	<div
		class={cn(
			'rounded-lg border p-4',
			message &&
				typeof message === 'object' &&
				message?.status === 'error' &&
				!subtle
				? 'bg-destructive text-destructive-foreground'
				: 'bg-secondary text-secondary-foreground',
		)}
	>
		<p class={cn('text-[0.8rem] font-medium')}>
			{typeof message === 'object' ? message.text : message}
		</p>
		<slot />
	</div>
{/if}
