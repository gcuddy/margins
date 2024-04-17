<script lang="ts">
	import { Card } from '@margins/ui';
	import type { Annotation } from '../data/annotation.js';
	import { ago } from '@margins/lib';

	export let annotation: Annotation;
	// TODO: user

	$: body = annotation.body;
</script>

<Card.Root class="text-xs">
	<Card.Header>
		{ago(new Date(annotation.createdAt), new Date())}
	</Card.Header>
	<Card.Content class="text-sm">
		<p>
			{body}
		</p>
	</Card.Content>
	<Card.Footer>tags</Card.Footer>
</Card.Root>
