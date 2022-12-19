<script lang="ts">
	import { show_tooltips } from '$lib/stores/Tooltips';
	import { createPopperActions } from 'svelte-popperjs';
	import { fly } from 'svelte/transition';
	import ButtonTooltip from './ButtonTooltip.svelte';
	interface Tooltip {
		text: string;
		kbd?: string;
	}
	export let tooltip: Tooltip | undefined = undefined;
	const [popperRef, popperContent] = createPopperActions({
		placement: 'bottom',
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: [0, 8],
				},
			},
		],
	});
	let tooltip_visible = false;
	let tooltip_timeout: ReturnType<typeof setTimeout> | undefined;
	function showTooltip() {
		// show tooltip after 300 msecond delay
		// if show_tooltips is true, then just show it — means we already we're hovering over another one
		if ($show_tooltips) {
			tooltip_visible = true;
		}
		tooltip_timeout = setTimeout(() => {
			tooltip_visible = true;
			show_tooltips.set(true);
		}, 500);
	}
	function hideTooltip() {
		clearTimeout(tooltip_timeout);
		tooltip_visible = false;
		// in 300ms set hide_tooltips to false
		setTimeout(() => {
			show_tooltips.set(false);
		}, 300);
	}
</script>

{#if tooltip}
	<div use:popperRef on:click={hideTooltip} on:mouseenter={showTooltip} on:mouseleave={hideTooltip}>
		<slot />
	</div>
	{#if tooltip && tooltip_visible}
		<!-- todo: add delay -->
		<div use:popperContent class="z-50">
			<div transition:fly={{ y: 5, duration: 150 }}>
				<ButtonTooltip {...tooltip} />
			</div>
		</div>
	{/if}
{:else}
	<slot />
{/if}
