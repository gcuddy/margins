<script lang="ts">
	import Heading from '$lib/ui/heading.svelte';
	import Text from '$lib/ui/text.svelte';
	import type { Entry } from '@margins/api2/src/Domain/Entry';
	import { Option as O } from 'effect';
	import Option from '../stream/option.svelte';

	const { entry }: { entry: Entry } = $props();
</script>

<div class="container mx-auto md:px-9 sm:px-7 xs:px-6 px-5 py-20">
	<article class="">
		<header class="flex flex-col justify-center">
			<Heading class="text-center max-w-prose">
				{entry.title.pipe(O.getOrElse(() => '(no title)'))}
			</Heading>
		</header>

		<section class="max-w-prose mx-auto">
			<Option option={entry.html}>
				{#snippet some(html)}
					{@html html}
				{/snippet}
				{#snippet none()}
					(no content)
				{/snippet}
			</Option>
		</section>
	</article>
</div>
