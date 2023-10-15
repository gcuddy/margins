<script lang="ts">
	import { Button } from '$components/ui/button';
	import { cn } from '$lib';
	import { createEventDispatcher } from 'svelte';

	export let open = false;

	const dispatch = createEventDispatcher();

	let className: string | null | undefined = undefined;
	export { className as class };

    export let href: string | undefined = undefined;
</script>

<Button
	on:click={(e) => {
		open = false;
		dispatch('click');
	}}
	class={cn('flex w-full items-center justify-start space-x-2 py-6', className)}
	variant={'ghost'}
    {href}
>
	<slot />
</Button>
