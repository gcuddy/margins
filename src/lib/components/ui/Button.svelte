<script lang="ts" context="module">
	export const buttonVariants = cva(
		'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
        // [&>svg]:text-muted-foreground[&>svg]:text-muted-foreground
		{
			variants: {
				variant: {
					default: 'bg-primary text-primary-foreground hover:bg-primary/90 [&>svg]:text-inherit',
					destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
					outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
					// dashed: 'border border-input hover:bg-accent hover:text-accent-foreground border-dashed',
					secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
					ghost: 'hover:bg-accent hover:text-accent-foreground',
					link: 'underline-offset-4 hover:underline text-primary'
				},
				size: {
					default: 'h-10 py-2 px-4',
					sm: 'h-9 px-2 rounded-md',
					lg: 'h-11 px-8 rounded-md',
					xs: 'h-8 px-1.5 text-xs'
				}
			},
			defaultVariants: {
				variant: 'default',
				size: 'default'
			}
		}
	);
</script>

<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { Action } from 'svelte/action';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	import { noop } from '$lib/helpers';
	import { cn } from '$lib/utils/tailwind';

	export let href: HTMLAnchorAttributes['href'] = undefined;
	export let type: HTMLButtonAttributes['type'] = undefined;

	export let variant: VariantProps<typeof buttonVariants>['variant'] = 'default';
	export let size: VariantProps<typeof buttonVariants>['size'] = 'default';
	export let action: Action = noop;
	export let ref: HTMLElement | undefined = undefined;
	export let text: string | undefined = undefined;
	export let onClick: MouseEvent | undefined = undefined;

    export let as: "a" | "button" | "div" = "button";

	let className: string | undefined | null = '';
	export { className as class };

	type Props = {
		class?: string | null;
		variant?: VariantProps<typeof buttonVariants>['variant'];
		size?: VariantProps<typeof buttonVariants>['size'];
		action?: Action | (() => void);
	};

	type AnchorElement = {
		href?: HTMLAnchorAttributes['href'];
		type?: never;
	} & Props & HTMLAnchorAttributes

	type ButtonElement = {
		type?: HTMLButtonAttributes['type'];
		href?: never;
        as?: "button" | undefined;
	} & Props & HTMLButtonAttributes

    type GenericElement = {
        type?: never;
        href?: never;
        as: "div";
    } & Props & HTMLButtonAttributes

	type $$Props = AnchorElement | ButtonElement | GenericElement;
</script>

<svelte:element
	this={href ? 'a' : as}
	type={as === "button" ? type : undefined}
	{href}
	class={cn(buttonVariants({ variant, size, className }))}
	role="button"
	tabindex="0"
	{...$$restProps}
	bind:this={ref}
	on:click={onClick}
	on:click
	on:pointerdown
	on:change
	on:keydown
	on:keyup
	on:mouseenter
	on:mouseleave
	use:action
>
	<slot>
		{#if text}
			{text}
		{/if}
	</slot>
</svelte:element>
