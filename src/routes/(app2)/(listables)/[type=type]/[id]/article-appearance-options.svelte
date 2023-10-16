<script lang="ts">
	import { Settings2 } from 'lucide-svelte';

	import { Button } from '$components/ui/button';
	import * as Popover from '$components/ui/popover';

	import ArticleAppearanceOptionsContent from './article-appearance-options-content.svelte';

</script>

<Popover.Root>
	<Popover.Trigger asChild let:builder={popoverBuilder}>
		<Button builders={[popoverBuilder]} variant="outline">
			<Settings2 class="h-4 w-4" />
			<span class="sr-only">Open popover</span>
		</Button>
	</Popover.Trigger>
	<Popover.Content class="max-w-sm">
		<ArticleAppearanceOptionsContent />
	</Popover.Content>
</Popover.Root>

