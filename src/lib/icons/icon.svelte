<script lang="ts">
	const defaultAttributes = {
		xmlns: 'http://www.w3.org/2000/svg',
		width: 24,
		height: 24,
		viewBox: '0 0 24 24',
		fill: 'none',
		stroke: 'currentColor',
		'stroke-width': 2,
		'stroke-linecap': 'round',
		'stroke-linejoin': 'round',
	} as const;

	export let color = 'currentColor';
	export let size: number | string = 24;
	export let strokeWidth: number | string = 2;

	let className: string | null | undefined = undefined;
	export { className as class };
</script>

<svg
	{...defaultAttributes}
	{...$$restProps}
	width={size}
	height={size}
	stroke={color}
	stroke-width={strokeWidth}
	class={className}
>
	<!-- SLOT: expects children of svg -->
	<slot />
</svg>
