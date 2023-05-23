<script>
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { H1 } from '$lib/components/ui/typography';

    export let data;

	/** @type {import('./$types').ActionData} */
	export let form;
</script>

<svelte:head>
	<title>Add URL or File</title>
</svelte:head>

<H1>Add</H1>

<fieldset>
	<legend>Add url</legend>
	<Input type="text" placeholder="URL" />
	<Button>Submit</Button>
</fieldset>

<form
	method="POST"
	use:enhance
	action="?/add_file"
	enctype="multipart/form-data"
>
	<fieldset>
		<legend>Add file</legend>
		<Input accept=".pdf" name="file" type="file" />
		<Button>Submit</Button>
		<Button formaction="?/thumbnail">Generate thumbnail</Button>
	</fieldset>
</form>

{data.S3_BUCKET_PREFIX}{form?.Key}

{JSON.stringify(form)}