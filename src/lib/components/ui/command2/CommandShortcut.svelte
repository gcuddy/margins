<script lang="ts">
	import { cn } from '$lib/utils';
	import type { ElProps } from './types';

	type $$Props = ElProps<HTMLElement>;

	let className: $$Props['class'] = undefined;
	export { className as class };
	export let unstyled = false;
</script>

<kbd
	class={cn(!unstyled && 'ml-auto text-xs tracking-widest text-muted-foreground', className)}
	{...$$restProps}
>
	<slot /></kbd
>
