<script lang="ts">
	import type { Annotation } from '@prisma/client';

	export let annotations: Annotation[];
</script>

{#each annotations as annotation}
	<div class="max-h-24 md:max-h-32">
		<div class="flex h-full border-gray-100 p-4 dark:border-gray-800">
			<!-- TODO: link to annotation -->
			{annotation.body}
		</div>
	</div>
{/each}
