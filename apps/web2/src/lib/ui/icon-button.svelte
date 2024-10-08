<script lang="ts">
	import { iconButton, type IconButtonSvelteProps } from '$lib/ui/button.props';

	type Props = IconButtonSvelteProps;

	let { children, variant, class: className, color, size, ...rest }: Props = $props();
</script>

<button class={iconButton({ variant, className, size })} data-accent-color={color} {...rest}>
	{#if children}
		{@render children()}
	{/if}
</button>
