<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	import { inputVariants } from '../Input.svelte';

	import type { FieldPath, UnwrapEffects } from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import type { z, AnyZodObject } from 'zod';
	import { cn } from '$lib/utils/tailwind';

	type T = $$Generic<AnyZodObject>;

	export let form: SuperForm<UnwrapEffects<T>, unknown>;
	export let field: keyof z.infer<T> | FieldPath<z.infer<T>>;

	const { path, value, errors, constraints } = formFieldProxy(form, field);

	let className = '';
	export { className as class };

	interface $$Props extends Omit<HTMLInputAttributes, 'form'> {
		form: SuperForm<UnwrapEffects<T>, unknown>;
		field: keyof z.infer<T> | FieldPath<z.infer<T>>;
		class?: string;
	}
</script>

<input
	class={cn(inputVariants(), className)}
	type="text"
	data-invalid={$errors}
	bind:value={$value}
	{...$constraints}
	{...$$restProps}
/>
{#if $errors}<span class="invalid">{$errors}</span>{/if}

<style lang="postcss">
	.invalid {
		color: orangered;
	}
</style>
