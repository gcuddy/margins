<script lang="ts">
	import { baseButton, type BaseButtonProps } from '$lib/ui/button.props';
	import type { Snippet } from 'svelte';

	type Props = BaseButtonProps & {
		class?: string;
		children: Snippet;
	};

	let { children, variant, class: className }: Props = $props();
</script>

<button class={baseButton({ variant, className })} data-accent-color={color}>
	{@render children()}
</button>
