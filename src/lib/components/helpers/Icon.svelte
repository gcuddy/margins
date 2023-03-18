<script lang="ts">
	import { icons, type Icon, type IconName, type SvgSrc } from '$lib/icons';
	const directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'] as const;
	`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
</svg>`;
	export let name: IconName;
	let solid = name.endsWith('Solid');
	export let direction: typeof directions[number] = 'n';
	export let fill: string | undefined = !solid ? 'none' : undefined;
	export let wrapper = true;
	$: rotation = directions.indexOf(direction) * 45;
	$: path = icons[name]?.svg;
	$: box = icons[name]?.box;
	$: viewBox = `0 0 ${box} ${box}`;

	let hwClass = 'h-5 w-5';
	switch (icons[name].box) {
		case '24':
			hwClass = 'h-6 w-6';
			break;
		case '16':
			hwClass = 'h-5 w-5';
			break;
	}

	export let className = hwClass + (!solid ? ` stroke-current fill-none` : ' fill-current');
	// export { className as class };
</script>

{#if wrapper}
	<div class="inline-flex items-center" {...$$restProps}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class={className}
			{viewBox}
			stroke-width={!solid ? icons[name].strokeWidth || 2 : undefined}
			{fill}
            stroke-linecap="round"
			style="transform: rotate({rotation}deg);"
			><g> {@html path}</g>
		</svg>
	</div>
{:else}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		{viewBox}
		{fill}
		style="transform: rotate({rotation}deg);"
		><g> {@html path}</g>
	</svg>
{/if}
