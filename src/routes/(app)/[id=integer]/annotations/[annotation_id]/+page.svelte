<script lang="ts">
	// TODO: fix this
	import type { Error, Result } from '$lib/actions/form';
	import AnnotationInput from '$lib/components/AnnotationInput.svelte';

	import Button from '$lib/components/Button.svelte';
	import Form from '$lib/components/Form.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import { notifications } from '$lib/stores/notifications';
	import type { AnnotationWithArticle } from '$lib/types';
	import type { PageData } from '../../../../../../.svelte-kit/types/src/routes/[id=integer]/annotations/[annotation_id]/$types';
	export let data: PageData;
	let { annotation } = data;
	let { article } = annotation;
	const done: Result = async () => {
		notifications.notify({
			message: 'Annotation saved!',
			type: 'success',
		});
	};
	const error: Error = async ({ error }) => {
		console.error(error);
		notifications.notify({
			message: 'Error saving annotation',
			type: 'error',
		});
	};
	console.log({ annotation });
</script>

<div class="space-y-4">
	<h1>Annotation for <a class="underline" href="/{article.id}">{article.title}</a></h1>
	<AnnotationInput
		action="/{article.id}/annotations/{annotation.id}"
		method="patch"
		value={annotation.text}
	/>
	<!-- <Form action="/{article.id}/annotations/{annotation.id}" method="patch" {done} {error}>
			<Textarea value={annotation.text} id="text" />
			<Button type="submit">Submit</Button>
		</Form> -->
</div>
