<script lang="ts">
	import Heading from '$lib/ui/heading.svelte';
	import Text from '$lib/ui/text.svelte';
	import type { Entry } from '@margins/api2/src/Domain/Entry';
	import { Option as O } from 'effect';
	import Option from '../stream/option.svelte';
	import { Heart } from 'svelte-radix';
	import IconButton from '$lib/ui/icon-button.svelte';

	const { entry }: { entry: Entry } = $props();
</script>

<div>
	<IconButton>
		<Heart size={15} />
	</IconButton>
</div>
<div class="overflow-auto mx-auto md:px-9 sm:px-7 xs:px-6 px-5 py-20">
	<article class="max-w-prose space-y-12">
		<header class="flex flex-col justify-center">
			<Heading size="7" class="text-center max-w-prose text-pretty">
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
