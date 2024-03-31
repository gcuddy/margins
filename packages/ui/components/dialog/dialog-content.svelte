<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import * as Dialog from './index.js';
	import { cn, flyAndScale } from '@margins/lib';
	import X from 'lucide-svelte/icons/x';

	type $$Props = DialogPrimitive.ContentProps & {
		showX?: boolean;
		variant?: Dialog.DialogVariant;
	};

	let className: $$Props['class'] = undefined;
	export let transition: $$Props['transition'] = flyAndScale;
	export let transitionConfig: $$Props['transitionConfig'] = {
		duration: 150,
	};
	export let showX: $$Props['showX'] = true;
	export let variant: $$Props['variant'] = 'fixed';
	export { className as class };
</script>

<Dialog.Portal>
	<Dialog.Overlay />
	<DialogPrimitive.Content
		{transition}
		{transitionConfig}
		class={cn(
			Dialog.dialogVariants({
				className,
				variant,
			}),
		)}
		{...$$restProps}
	>
		<slot />
		{#if showX}
			<DialogPrimitive.Close
				class="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none"
			>
				<X class="h-4 w-4" />
				<span class="sr-only">Close</span>
			</DialogPrimitive.Close>
		{/if}
	</DialogPrimitive.Content>
</Dialog.Portal>
