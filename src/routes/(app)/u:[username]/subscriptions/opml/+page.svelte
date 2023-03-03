<script>
	import { enhance } from "$app/forms";
	import Button from "$lib/components/Button.svelte";
	import DotMenu from "$lib/components/DotMenu.svelte";
	import { notifications } from "$lib/stores/notifications";
	/** @type {import('./$types').ActionData} */
	export let form;
	$: console.log({ form });
</script>

<div class="container mx-auto px-4">
	<h1>OPML</h1>
	{#if !form || form?.message}
		{#if form?.message}
			<p>{form.message}</p>
		{/if}
		<form use:enhance action="?/submitOpml" method="post">
			<label class="block"
				><span class="sr-only">Upload your OPML File.</span>
				<input
					type="file"
					name="opml"
					id="opml-upload"
					class="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-primary-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-primary-700 file:hover:bg-primary-100"
					accept=".opml,.xml"
				/>
			</label>
			<button type="submit">Submit</button>
		</form>
	{:else}
		<form
			action="?/submitUrls"
			method="post"
			use:enhance={() => {
				notifications.notify({
					message:
						"URLs are being processed in the background. Please refresh in a little bit to see the results.",
					title: "Processing urls",
				});
			}}
		>
			<div class="flex flex-col space-y-4 border">
				<div class="flex items-center space-x-4 px-2">
					<div class="grid grow grid-cols-2 place-items-center">
						<span>Name</span>
						<span>URL</span>
					</div>
				</div>
				<ul class="max-h-52 overflow-y-auto">
					{#each form.opml.body.outline.filter((o) => o.type === "rss" && o.xmlUrl) as item, index}
						<li class="flex items-center space-x-4 px-2">
							<input type="checkbox" name="url:{index}" value={item.xmlUrl} class="shrink-0" />
							<input type="hidden" name="title:{index}" value={item.text} />
							<div class="grid grow grid-cols-2">
								<span class="truncate">{item.text}</span>
								<span class="truncate">{item.xmlUrl}</span>
							</div>
						</li>
					{/each}
				</ul>
			</div>
			<Button type="submit">Submit</Button>
		</form>
	{/if}
</div>
