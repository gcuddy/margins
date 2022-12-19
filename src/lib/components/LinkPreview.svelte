<script lang="ts">
	export let title: string = '';
	export let url: string = '';
	export let image: string = '';
	const getHost = (url: string) => {
		try {
			return new URL(url).host;
		} catch (e) {
			return url;
		}
	};
</script>

<div class="flex max-h-60 max-w-xs flex-col overflow-hidden rounded-lg">
	<img src={image} alt={title} class="max-h-40 shrink basis-0 rounded-t-lg object-cover" />
	<div class="max-h-20 min-h-fit shrink-0 bg-gray-200 px-3 py-2 leading-tight">
		<h3 class="text-sm font-medium line-clamp-3">{title}</h3>
		<p class="text-xs text-gray-500">{getHost(url)}</p>
	</div>
</div>
