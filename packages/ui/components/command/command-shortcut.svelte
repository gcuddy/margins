<script lang="ts">
	import { cn } from '@margins/lib';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Props = HTMLAttributes<HTMLSpanElement>;

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<span
	class={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)}
	{...$$restProps}
>
	<slot />
</span>
