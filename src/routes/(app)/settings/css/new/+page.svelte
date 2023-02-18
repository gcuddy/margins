<script lang="ts">
	import type { PageData } from '../../../../../../.svelte-kit/types/src/routes/settings/css/new/$types';
	// export let data: PageData;
	// let { css } = data;
</script>

<h1>New CSS</h1>

<input type="text" name="domain" placeholder="Domain" />
<!-- use codemirror for this, or other lightweight code highlighter -->
<textarea placeholder="Custom CSS e.g. p{`{color: red;}`}" name="css" />
