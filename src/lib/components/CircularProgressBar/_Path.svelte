<!-- ported from https://github.com/kevinsqi/react-circular-progressbar/blob/master/src/Path.tsx -->
<script>
	import { VIEWBOX_CENTER_X, VIEWBOX_CENTER_Y } from './constants';
	export let className, counterClockwise, dashRatio, pathRadius, strokeWidth, style;

	// SVG path description specifies how the path should be drawn
	function getPathDescription({ pathRadius, counterClockwise }) {
		const radius = pathRadius;
		const rotation = counterClockwise ? 1 : 0;

		// Move to center of canvas
		// Relative move to top canvas
		// Relative arc to bottom of canvas
		// Relative arc to top of canvas
		return `
      M ${VIEWBOX_CENTER_X},${VIEWBOX_CENTER_Y}
      m 0,-${radius}
      a ${radius},${radius} ${rotation} 1 1 0,${2 * radius}
      a ${radius},${radius} ${rotation} 1 1 0,-${2 * radius}
    `;
	}

	function getDashStyle({ counterClockwise, dashRatio, pathRadius }) {
		const diameter = Math.PI * 2 * pathRadius;
		const gapLength = (1 - dashRatio) * diameter;

		// stroke-dash: Have dash be full diameter, and gap be full diameter
		// stroke-dash-offset: Shift dash backward by gapLength, so gap starts appearing at correct distance
		return `
    stroke-dasharray: ${diameter}px ${diameter}px;
    stroke-dashoffset: ${counterClockwise ? -gapLength : gapLength}px;`;
	}
</script>

<path
	class={className}
	style={style + getDashStyle({ pathRadius, dashRatio, counterClockwise })}
	d={getPathDescription({
		pathRadius,
		counterClockwise
	})}
	stroke-width={strokeWidth}
	fill-opacity="0"
/>

<style>
	.CircularProgressbar-path {
		stroke: gray;
		stroke-linecap: butt;
		transition: stroke-dashoffset 0.3s ease 0s;
	}

	.CircularProgressbar-trail {
		stroke: white;
		/* Used when trail is not full diameter, i.e. when props.circleRatio is set */
		stroke-linecap: butt;
	}
</style>
