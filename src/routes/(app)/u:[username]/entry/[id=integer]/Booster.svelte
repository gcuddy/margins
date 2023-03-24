<script lang="ts">
	import GenericTextarea from "$lib/components/GenericTextarea.svelte";

	// display css
	export let css: string;

	// TODO: scope/un-scope

	// this should use codemirror..... eventually
	// import { CodeJar } from "codejar";
	import { onMount } from "svelte";
	// import hljs from "highlight.js/lib/core";
	// import hlcss from "highlight.js/lib/languages/css";
	// hljs.registerLanguage("css", hlcss);
	import { scopeCss, unscopeCss } from "./css";
	// import debounce from "lodash.debounce";

	let ref: HTMLTextAreaElement;

	// const scope = debounce(scopeCss, 500);

	onMount(async () => {
		// const { CodeJar } = await import("codejar");
		const jar = CodeJar(ref, hljs.highlightElement);
		jar.updateCode(unscopeCss(css) || "");
		jar.onUpdate((code) => {
			console.log({ code });
			css = scopeCss(code) || "";
		});
	});
</script>

<div class="mt-14" bind:this={ref} />
<!-- <GenericTextarea bind:el={ref} name="css" /> -->
