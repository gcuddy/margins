<script lang="ts">
	import {
		VIEWBOX_WIDTH,
		VIEWBOX_HEIGHT,
		VIEWBOX_HEIGHT_HALF,
		VIEWBOX_CENTER_X,
		VIEWBOX_CENTER_Y
	} from './constants';
	import Path from './_Path.svelte';
	export let value: number;
	export let background = false;
	export let backgroundPadding = 0;
	export let circleRatio = 1;
	export let classes = {
		root: 'CircularProgressbar',
		trail: 'CircularProgressbar-trail',
		path: 'CircularProgressbar-path',
		text: 'CircularProgressbar-text',
		background: 'CircularProgressbar-background'
	};
	export let trailClass = '';
	export let pathClass = '';
	export let counterClockwise = false;
	export let className = '';
	export let maxValue = 100;
	export let minValue = 0;
	export let strokeWidth = 8;
	export let style = '';
	export let styles = {
		root: '',
		trail: '',
		path: '',
		text: '',
		background: ''
	};
	export let backgroundStyle = '';
	export let text = '';

	function getBackgroundPadding() {
		if (!background) {
			// Don't add padding if not displaying background
			return 0;
		}
		return backgroundPadding;
	}

	function getPathRadius() {
		// The radius of the path is defined to be in the middle, so in order for the path to
		// fit perfectly inside the 100x100 viewBox, need to subtract half the strokeWidth
		return VIEWBOX_HEIGHT_HALF - strokeWidth / 2 - getBackgroundPadding();
	}

	// Ratio of path length to trail length, as a value between 0 and 1
	function getPathRatio() {
		console.log('path');
		const boundedValue = Math.min(Math.max(value, minValue), maxValue);
		return (boundedValue - minValue) / (maxValue - minValue);
	}
	$: pathRatio = (Math.min(Math.max(value, minValue), maxValue) - minValue) / (maxValue - minValue);
	$: pathRadius = VIEWBOX_HEIGHT_HALF - strokeWidth / 2 - getBackgroundPadding();

	// 	let width = 100;
	// 	export let stroke = 1;
	// 	export let progress = 50;
	// 	export let color = "white";
	// 	export let background = "transparent";
	// 	let height = width;
	// 	let radius = (width / 2) - (stroke * 2);
	// 	let circumference = radius * 2 * Math.PI;
	// 	let strokeDashOffset = circumference - progress / 100 * circumference;

	// 	let show = false;
</script>

<!-- TODO: add aria https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/progressbar_role -->

<div aria-valuemin={minValue} aria-valuemax={maxValue} aria-valuenow={value}>
	<svg
		class={classes.root + className}
		{style}
		viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
		data-test-id="CircularProgressbar"
		on:click
	>
		{#if background}
			<circle
				class="CircularProgressbar-background"
				style={backgroundStyle}
				cx={VIEWBOX_CENTER_X}
				cy={VIEWBOX_CENTER_Y}
				r={VIEWBOX_HEIGHT_HALF}
			/>
		{/if}

		<Path
			className={trailClass}
			{counterClockwise}
			dashRatio={circleRatio}
			{pathRadius}
			{strokeWidth}
			style={styles.trail}
		/>

		<Path
			className={pathClass}
			{counterClockwise}
			dashRatio={pathRatio * circleRatio}
			{pathRadius}
			{strokeWidth}
			style={styles.path}
		/>

		{#if text}
			<text
				class="CircularProgressbar-text"
				style={styles.text}
				x={VIEWBOX_CENTER_X}
				y={VIEWBOX_CENTER_Y}
			>
				{text}
			</text>
		{/if}
	</svg>
</div>

<style>
	.CircularProgressbar {
		width: 100%;
		vertical-align: middle;
	}

	.CircularProgressbar .CircularProgressbar-text {
		fill: #3e98c7;
		font-size: 1.2em;
		dominant-baseline: middle;
		text-anchor: middle;
	}

	.CircularProgressbar .CircularProgressbar-background {
		fill: hsla(var(--hue) 69% 61% / 36%);
	}
</style>
