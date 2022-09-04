<script lang="ts">
	import type { invalidate as Invalidate } from '$app/navigation';

	import { enhance, type Error, type Pending, type Result } from '$lib/actions/form';
	export let action: string;
	export let pending: Pending | undefined = undefined;
	export let error: Error | undefined = undefined;
	export let done: Result | undefined = undefined;
	export let invalidate: Parameters<typeof Invalidate>[0] = action;
	// optionally specify notification (shortcut for doing it via done)
	export let method: 'get' | 'post' | 'put' | 'delete' | 'patch' = 'get';
	export let check: () => boolean = () => true;
	export let headers: Headers | undefined = undefined;
	let method_override = '';
	$: if (method !== 'get' && method !== 'post') {
		method_override = '?_method=' + method;
		method = 'post';
	}
	export let classOverride = 'space-y-2';
	export let className = '';
	export let disableJs = false;
	export let el: HTMLFormElement | undefined = undefined;

	/** If enabled, goto will send us directly to the form action, but programatically with Sveltekit*/
	export let goto = true;
</script>

{#if disableJs}
	<form {method} action="{action}{method_override}" class="{classOverride} {className}">
		<slot />
	</form>
{:else}
	<form
		bind:this={el}
		on:submit|preventDefault
		use:enhance={{ pending, error, invalidate, result: done, goto, headers, check }}
		{method}
		action="{action}{method_override}"
		class="{classOverride} {className}"
	>
		<slot />
	</form>
{/if}
