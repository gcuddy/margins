<script lang="ts">
	export let data;
</script>

<div class="prose prose-stone dark:prose-invert mx-auto">
	<div class="pt-4 sm:pt-8">
		<h1
			class="text-balance text-3xl font-semibold tracking-tighter sm:text-5xl"
		>
			{data.meta.title}
		</h1>
	</div>

	<svelte:component this={data.content} />
</div>
