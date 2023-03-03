<script lang="ts">
	export let lg = true;
	export let xl = false;
	let classname = "";
	export { classname as class };
	import cx from "classnames";
</script>

<h1
	class={cx("text-3xl font-semibold tracking-tight md:text-4xl " + classname, {
		"lg:text-5xl": lg,
        "xl:text-6xl": xl,
	})}
>
	<slot />
</h1>
