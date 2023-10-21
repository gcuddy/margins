<script lang="ts">
	import { navigating, page } from '$app/stores';
	import Header from '$components/ui/Header.svelte';
	import NativeSelect from '$components/ui/NativeSelect.svelte';
	import Input from '$components/ui/input/input.svelte';
	import Label from '$components/ui/label/label.svelte';
	import { make_link } from '$lib/utils/entries';
	import { Loader2 } from 'lucide-svelte';

	export let data;

	import { MagnifyingGlass } from 'radix-icons-svelte';
	import { derived } from 'svelte/store';

	const path = $page.url.pathname;

	const searching = derived(navigating, ($navigating) => {
		console.log({ $navigating, path });
		return (
			$navigating?.to?.url.pathname === path &&
			$navigating.to.url.searchParams.has('q')
		);
	});
</script>

<Header>
	<form class="flex grow gap-8" data-sveltekit-keepfocus>
		<div class="flex flex-col grow">
			<div class="relative">
				<Input
					value={$page.url.searchParams.get('q')}
					class="pl-8 bg-card text-card-foreground"
					name="q"
					placeholder="search"
					type="text"
				/>
				<span class="absolute left-2 top-1/2 -translate-y-1/2">
					<svelte:component
						this={$searching ? Loader2 : MagnifyingGlass}
						class="h-4 w-4 text-muted-foreground {$searching
							? 'animate-spin'
							: ''}"
					/>
				</span>
			</div>
		</div>

		<!-- TODO: eventually would be niec to have icons -->
		<div class="flex flex-col gap-px">
			<NativeSelect name="scope" class="w-max" value={$page.url.searchParams.get('scope')}>
				<optgroup label="My stuff">
					<option value="l">Library</option>
					<option value="ls">Library + Subscriptions</option>
				</optgroup>
				<optgroup label="Elsewhere">
					<option value="books">Books</option>
					<option value="movies">Movies</option>
					<option value="Music">Music</option>
					<option value="Podcasts">Podcasts</option>
				</optgroup>
			</NativeSelect>
		</div>
	</form>
</Header>
<ul class="space-y-4">
	{#each data.entries ?? [] as entry}
		<li class="flex gap-6 items-center">
            <div>
                <img src={entry.image} alt="" class="w-10 aspect-auto rounded-smii" />
            </div>
			<div class="flex flex-col">
                <a href={make_link(entry)} class="font-medium">{@html entry.title}</a>
                <span class="text-sm">{@html entry.author}</span>
                {#if 'matchedText' in entry}
                    <span class="text-sm">{@html entry.matchedText}</span>
                {/if}
            </div>
		</li>
	{/each}
</ul>
