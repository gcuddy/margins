<script lang="ts">
	import { cn } from '@margins/lib';

	export let glass = false;
</script>

<header
	class={cn(
		'fixed left-0 right-0 top-0 z-40 h-[--header-height] border-b px-2',
		glass ? 'bg-glass/[.01] border-glass/10 backdrop-blur-md' : 'bg-background',
	)}
>
	<slot />
</header>
