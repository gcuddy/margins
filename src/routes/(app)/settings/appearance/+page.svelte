<script lang="ts">
	import { enhance, SubmitFunction } from "$app/forms";
	import ColorSwatch from "$lib/components/ColorSwatch.svelte";
	import type { ActionData, PageData } from "./$types";
	import { allowedThemesRegex, darkThemes } from "$lib/features/settings/themes";

	export let data: PageData;
	export let form: ActionData;
	$: console.log({ form });

	const submitUpdateTheme: SubmitFunction = ({ data, cancel }) => {
		const theme = String(data.get("theme"));
		if (allowedThemesRegex.test(theme)) {
			document.documentElement.setAttribute("data-theme", theme);
		}
		if (darkThemes.includes(theme)) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
		return () => {};
	};
</script>

<section>
	<h2>Themes</h2>
	<form method="post" action="?/setTheme" use:enhance={submitUpdateTheme}>
		<select value={data.theme} name="theme">
			<option value="default">Light</option>
			<option value="dark">Dark</option>
			<option value="synthwave">Synthwave</option>
		</select>
		<button type="submit">Save</button>
	</form>
</section>
<section>
	<h2>Custom Theme</h2>
	<form use:enhance action="?/generateColors" method="post">
		<label>
			Sidebar color
			<input type="color" name="color" /></label
		>
		<button type="submit">submit</button>
	</form>
	{#if form && "colors" in form && form?.colors}
		{#each Object.entries(form.colors) as [key, value]}
			<p>{key}: <ColorSwatch hex={value} /> {value}</p>
		{/each}
	{/if}
</section>
