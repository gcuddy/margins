<script lang="ts">
	import { isTouchDevice } from '$lib/utils';

	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import Button from '../Button.svelte';
	export let value = '';
	export let el: HTMLElement;
	export let scrollIntoView = true;
	const dispatch = createEventDispatcher<{
		save: {
			value: string;
		};
		cancel: void;
	}>();
	onMount(() => {
		el && scrollIntoView && el.scrollIntoView({ block: 'center', behavior: 'smooth' });
	});
</script>

<div
	bind:this={el}
	class="flex w-60 cursor-default scroll-mt-12 flex-col items-start gap-2.5 rounded-lg border border-gray-300 bg-white p-2.5 font-sans font-medium shadow-lg dark:border-gray-700 dark:bg-black sm:w-72"
>
	<!-- todo: auto expand -->
	<textarea
		on:keydown={(e) => {
			if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				dispatch('save', { value });
			}
		}}
		rows="3"
		placeholder="Add an annotation…"
		bind:value
		class="w-full resize-none border-0 bg-transparent placeholder-gray-400 transition focus:ring-0"
	/>
	<div class="flex flex-row items-center justify-end space-x-2 self-stretch">
		<!-- //todo -->
		<Button variant="ghost" on:click={() => dispatch('cancel')}>Cancel</Button>
		<Button
			variant="confirm"
			type="submit"
			on:click={() =>
				dispatch('save', {
					value
				})}>Save</Button
		>
	</div>
</div>
