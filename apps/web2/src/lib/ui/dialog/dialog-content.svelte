<script lang="ts">
	import { baseDialogContent, baseDialogOverlay } from '$lib/ui/dialog/dialog.props';
	import Theme from '$lib/ui/theme.svelte';
	import { Dialog } from 'bits-ui';
	import type { ComponentProps } from 'svelte';
	import { tv, type VariantProps } from 'tailwind-variants';

	const dialogScrollPadding = tv({
		base: 'grow m-auto pt-6 pb-[max(theme(spacing.6),6vh)] px-4',
		variants: {
			align: {
				start: 'mt-0 pt-[13vh]',
				center: 'mt-auto'
			}
		},
		defaultVariants: {
			align: 'start'
		}
	});

	let {
		children,
		class: classNameProp,
		align,
		...props
	}: ComponentProps<Dialog.Content> & VariantProps<typeof dialogScrollPadding> = $props();
</script>

<Dialog.Portal>
	<Theme>
		{#snippet child({ props: { class: className, ...rest } })}
			{$inspect({ className })}
			<Dialog.Overlay class={baseDialogOverlay({ className })} {...rest}>
				<div class="flex overflow-auto absolute inset-0 radix-themes">
					<div class={dialogScrollPadding({ align, className: classNameProp })}>
						<Dialog.Content class={baseDialogContent({ className: classNameProp })} {...props}
							>{@render children?.()}</Dialog.Content
						>
					</div>
				</div>
			</Dialog.Overlay>
		{/snippet}
	</Theme>
</Dialog.Portal>
