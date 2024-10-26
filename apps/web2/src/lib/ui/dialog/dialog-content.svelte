<script lang="ts">
	import { baseDialogContent, baseDialogOverlay } from '$lib/ui/dialog/dialog.props';
	import Theme from '$lib/ui/theme.svelte';
	import { Dialog } from 'bits-ui';
	import type { ComponentProps } from 'svelte';

	let { children, class: classNameProp, ...props }: ComponentProps<Dialog.Content> = $props();
	
</script>

<Dialog.Portal>
	<Theme>
		{#snippet child({ props: { class: className, ...rest } })}
			{$inspect({ className })}
			<Dialog.Overlay class={baseDialogOverlay({ className })} {...rest}>
				<div class="flex overflow-auto absolute inset-0 radix-themes">
					<div class="grow m-auto pt-6 pb-[max(theme(spacing.6),6vh)] px-4">
						<Dialog.Content class={baseDialogContent({ className: classNameProp })} {...props}
							>{@render children?.()}</Dialog.Content
						>
					</div>
				</div>
			</Dialog.Overlay>
		{/snippet}
	</Theme>
</Dialog.Portal>
