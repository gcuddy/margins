<script lang="ts">
	import Button from './Button.svelte';
	import Form from './Form.svelte';
	import Textarea from './Textarea.svelte';
</script>

<Form action="/api/bulk" method="post">
	<Textarea name="urls" label="List of urls separated by new lines" />
	<Button type="submit">Submit</Button>
</Form>
