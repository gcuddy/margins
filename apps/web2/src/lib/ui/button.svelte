<script lang="ts">
	import { button, type ButtonSvelteProps } from '$lib/ui/button.props';
	import type { Snippet } from 'svelte';

	type Props = ButtonSvelteProps & {
		class?: string;
		children: Snippet;
	};

	let { children, variant, class: className, color, size, ...rest }: Props = $props();
</script>

<button class={button({ variant, className, size })} data-accent-color={color} {...rest}>
	{@render children()}
</button>
