<script lang="ts">
	import { iconButton, type IconButtonSvelteProps } from '$lib/ui/button.props';

	type Props = IconButtonSvelteProps;

	let { children, child, variant, class: className, color, size, ...rest }: Props = $props();

	const attributes = $derived({
		class: iconButton({ variant, className, size }),
		'data-accent-color': color
	});
</script>

{#if child}
	{@render child({ props: attributes })}
{:else}
	<button {...attributes} {...rest}>
		{#if children}
			{@render children()}
		{/if}
	</button>
{/if}
