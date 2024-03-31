<script lang="ts">
	import { cn } from '@margins/lib';
	export let muted = false;
	export let mini = false;
	let className: string | null | undefined = undefined;
	export { className as class };
</script>

<span
	class={cn(
		'font-medium',
		mini ? 'text-xs' : 'text-sm',
		muted && 'text-muted-foreground',
		className,
	)}
>
	<slot />
</span>
