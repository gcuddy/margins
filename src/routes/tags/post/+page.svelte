<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { replaceRange } from '$lib/utils';
	import { tagRegex } from './_tag-constants';
	export let articleIds: number[] = [];
	export let tags = 'test another';
	export let autocompleteList: string[] = ['one', 'two', 'three'];
	let currentTag = '';
	let currentRange: [number, number] = [0, 0];
	$: splitTags = tags.split(' ');
	let input: HTMLInputElement;
	$: listOptions = currentTag
		? autocompleteList.filter(
				(item) => item.includes(currentTag) && item !== currentTag && !splitTags.includes(item)
		  )
		: [];
	const handleInput = (e: KeyboardEvent | MouseEvent) => {
		const el = e.target;
		if (el instanceof HTMLInputElement) {
			const pos = el.selectionStart;
			if (typeof pos !== 'number') return;
			const chars = el.value.split('');
			let curr = '';
			let start = 0;
			let end = chars.length;
			console.log({ pos });
			for (let i = pos; i < chars.length; i++) {
				end = i;
				if (chars[i] === ' ') break;
				curr += chars[i];
				console.log(i);
			}
			for (let i = pos - 1; i >= 0; i--) {
				start = i === 0 ? i : i + 1;
				if (chars[i] === ' ') break;
				curr = chars[i] + curr;
			}
			currentTag = curr;
			currentRange = [start, end];
			console.log(currentRange);
		}
	};
	function replaceTag(tag: string) {}
</script>

<!-- should make this conditional on having an id -->
<form action="/tags?_method=PATCH" method="post">
	{#each articleIds as id}
		<input type="hidden" name="id" value={id} />
	{/each}
	<div>
		<div>current tag: {currentTag}</div>
		<label for="tags">Tags should be space separated and contain no special characters</label>
		<div role="combobox" aria-expanded={listOptions.length > 0}>
			<input
				bind:this={input}
				class="block"
				type="text"
				on:keyup={handleInput}
				on:click={handleInput}
				bind:value={tags}
				name="tags"
				pattern={tagRegex.source}
				placeholder="Enter tags…"
			/>
		</div>
		<ul role="listbox">
			{#each listOptions as option, index}
				<li
					on:click={(e) => {
						tags = replaceRange(tags, ...currentRange, option);
						input.focus();
					}}
				>
					{option}
				</li>
			{/each}
		</ul>
	</div>
	<Button type="submit">Save</Button>
</form>
