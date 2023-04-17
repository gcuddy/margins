<script lang="ts">
	import type { HTMLBaseAttributes } from "svelte/elements";

	export let progress: number;

	interface $$Props extends HTMLBaseAttributes {
		progress: number;
	}
</script>

<div
	{...$$restProps}
	data-cmdk-loading
	role="progressbar"
	aria-valuenow={progress}
	aria-valuemin={0}
	aria-valuemax={100}
	aria-label="Loading..."
>
	<div aria-hidden>
		<slot />
	</div>
</div>
