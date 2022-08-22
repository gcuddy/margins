<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	let { css } = data;
</script>

<h1>Css</h1>

<!-- TODO: form to submit to settings/css, adding css -->
<h2>New Rule</h2>
<form action="/settings/css" method="post">
	<label
		>Add custom CSS (eventually add per domain, author, rule, and apply to smart
		folders/lists/playlists (whatever I'm calling them))</label
	>
	<input type="text" name="domain" placeholder="Domain" />
	<!-- use codemirror for this, or other lightweight code highlighter -->
	<textarea placeholder="Custom CSS e.g. p{`{color: red;}`}" name="css" />
</form>

{#each css as rule}
	{rule.domain} - {rule.css}
{/each}
