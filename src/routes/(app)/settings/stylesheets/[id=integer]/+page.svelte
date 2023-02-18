<script lang="ts">
	import type { PageData } from './$types';
	import type { CodeJar } from 'codejar';
	import type Prism from 'prismjs';
	import { onMount } from 'svelte';
	import GenericTextarea from '$lib/components/GenericTextarea.svelte';
	import Button from '$lib/components/Button.svelte';
	import { enhance } from '$app/forms';
	import GenericInput from '$lib/components/GenericInput.svelte';
	import { notifications } from '$lib/stores/notifications';
	import Icon from '$lib/components/helpers/Icon.svelte';
	export let data: PageData;
	let CodeJar: CodeJar;
	let prism: typeof Prism;
	let editor: HTMLElement | undefined;
	onMount(async () => {
		({ CodeJar } = await import('codejar'));
		prism = await import('prismjs');
		if (editor) {
			const jar = CodeJar(editor, prism.highlightElement, { tab: '\t' });
		}
	});
	$: console.log({ CodeJar, prism });
	let loading = false;
</script>

<!-- <div bind:this={editor} /> -->
<!-- <textarea name="" id="" cols="30" rows="10">
	{data.stylesheet.css}
</textarea> -->
<form
	class="flex flex-col gap-2"
	method="post"
	action="?/update"
	use:enhance={() => {
		loading = true;
		return async () => {
			loading = false;
			notifications.notify({
				type: 'success',
				title: 'Saved stylesheet',
			});
		};
	}}
>
	<GenericInput
		variant="naked"
		name="domain"
		class="px-0 text-lg font-medium"
		placeholder="domain"
		minlength="1"
		value={data.stylesheet.domain}
	/>
	<Button type="submit" className="place-self-end will-change-contents">
		{#if loading}
			<Icon name="loading" className="animate-spin h-4 w-4 fill-current" />
		{:else}
			Save
		{/if}
	</Button>
	<GenericTextarea name="css" value={data.stylesheet.css} />
</form>
