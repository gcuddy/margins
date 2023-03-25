<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements";
	import type { Writable } from "svelte/store";

	export let placeholder = "Enter text…";
	export let variant: "filled" | "ghost" | "underline" | "naked" = "filled";
	let className = "";
	export { className as class };
	export let el: HTMLElement | undefined = undefined;
	export let id = "";
	export let name = "";
	export let type: "text" | "number" | "password" | "email" = "text";
	type InputValue = string | number;
	export let value: InputValue | Writable<InputValue> =
		type === "number" ? 0 : "";
	export let min: number | undefined = undefined;
	export let max: number | undefined = undefined;
	export let autocomplete: string | undefined = undefined;

	interface $$Props extends HTMLInputAttributes {
		placeholder?: string;
		variant?: "filled" | "ghost" | "underline" | "naked";
		class?: string;
		el?: HTMLElement;
		id?: string;
		name?: string;
		type?: "text" | "number" | "password" | "email";
		value?: InputValue | Writable<InputValue>;
		min?: number;
		max?: number;
		autocomplete?: string;
	}

	// interface $$Props extends
</script>

{#if type === "text"}
	<input
		on:keydown
		on:change
		on:focus
		on:blur
		on:input
		bind:this={el}
		id={id ? id : undefined}
		name={name ? name : undefined}
		type="text"
		class="h-full w-full rounded-lg border-0 placeholder-gray-400 transition focus:ring-0 dark:placeholder-gray-500
  {variant === 'filled'
			? 'bg-gray-100 dark:bg-gray-700'
			: variant === 'underline'
			? 'rounded-none border-b border-gray-300 bg-transparent focus:border-amber-300 dark:border-gray-600'
			: variant === 'ghost'
			? 'bg-transparent ring-gray-300 focus:bg-gray-100 hover:ring-1'
			: 'bg-transparent'}
  {className}"
		{placeholder}
		{autocomplete}
		{...$$restProps}
		bind:value
	/>
{:else if type === "email"}
	<input
		on:keydown
		on:focus
		on:blur
		bind:this={el}
		id={id ? id : undefined}
		name={name ? name : undefined}
		type="email"
		class="h-9 w-full rounded-lg border-0 placeholder-gray-400 transition focus:ring-0
  {variant === 'filled'
			? 'bg-gray-100 dark:bg-gray-700'
			: variant === 'underline'
			? 'rounded-none border-b border-gray-300 bg-transparent focus:border-amber-300 dark:border-gray-600'
			: 'bg-transparent ring-gray-300 focus:bg-gray-100 hover:ring-1'}
  {className}"
		{placeholder}
		{autocomplete}
		{...$$restProps}
		bind:value
	/>
{:else if type === "number"}
	<input
		on:keydown
		on:focus
		on:blur
		bind:this={el}
		id={id ? id : undefined}
		name={name ? name : undefined}
		type="number"
		class="h-9 w-full rounded-lg border-0 placeholder-gray-400 transition focus:ring-0
  {variant === 'filled'
			? 'bg-gray-100 dark:bg-gray-700'
			: 'bg-transparent ring-gray-300 focus:bg-gray-100 hover:ring-1'}
  {className}"
		{placeholder}
		{autocomplete}
		{...$$restProps}
		{min}
		{max}
		bind:value
	/>
{:else if type === "password"}
	<input
		on:keydown
		on:focus
		on:blur
		bind:this={el}
		id={id ? id : undefined}
		name={name ? name : undefined}
		type="password"
		class="h-9 w-full rounded-lg border-0 placeholder-gray-400 transition focus:ring-0
  {variant === 'filled'
			? 'bg-gray-100 dark:bg-gray-700'
			: 'bg-transparent ring-gray-300 focus:bg-gray-100 hover:ring-1'}
  {className}"
		{placeholder}
		{autocomplete}
		{...$$restProps}
		{min}
		{max}
		bind:value
	/>
{/if}
