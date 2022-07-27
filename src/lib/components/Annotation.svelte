<script lang="ts">
	let text: string;
</script>

<div>
	<!-- if small, show little note instead of text -->
	<div class="block h-6 w-6 border-4 border-black/90 bg-yellow-300/90 md:hidden" />
	<div
		class="hidden h-8 max-w-xs overflow-auto border-4 border-2 border-black/90 bg-yellow-100/90 md:block"
	>
		<div class="text-gray-900 dark:text-white">
			{text}
		</div>
	</div>
</div>
