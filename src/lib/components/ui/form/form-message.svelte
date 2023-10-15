<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Message } from '$lib/types/forms';
	// let className: string | undefined | null = undefined;
	// export { className as class };

	export let message: Message | string | undefined | null = undefined;
</script>

{#if message}
	<div
		class={cn(
			'border p-4 rounded-lg',
			message && typeof message === 'object' && message?.status === 'error'
				? 'bg-destructive text-destructive-foreground'
				: 'bg-secondary text-secondary-foreground',
		)}
	>
		<p class={cn('text-[0.8rem] font-medium')}>
			{typeof message === 'object' ? message.text : message}
		</p>
	</div>
{/if}
