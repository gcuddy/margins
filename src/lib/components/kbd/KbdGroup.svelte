<script lang="ts">
	import {
		leaders,
		modifiers,
		specialKeys,
		specialKeysUnicodeLookup,
		type ShortcutKey
	} from '$lib/types/keyboard';
	export let kbd: ShortcutKey[][];

	export const leaderCheck = (key: string | undefined) => (key ? leaders.includes(key) : false);

	export const format = (key: ShortcutKey) => {
		if (modifiers.includes(key)) {
			// return unicode versions of modifiers
			return key === 'ctrl'
				? '\u2303'
				: key === 'shift'
				? '\u21E7'
				: key === 'alt'
				? '\u2325'
				: '\u2318';
		} else if (specialKeys.includes(key)) {
			// return unicode versions of specialkeys
			return specialKeysUnicodeLookup[key];
		} else {
			return key;
		}
	};
</script>

<div class="flex gap-2">
	{#each kbd as kbd, index}
		{#if index > 0}
			<span class="self-center text-xs">or</span>
		{/if}
		<div class="flex space-x-1">
			{#each kbd as k, index}
				{#if index > 0 && leaderCheck(kbd[index - 1])}
					<span class="self-center text-xs">then</span>
				{/if}
				<kbd
					class="inline-block w-auto min-w-[1rem] rounded-sm bg-gray-500 px-1.5 py-0.5 text-center align-baseline font-sans text-xs font-medium uppercase   text-white dark:bg-gray-800"
					>{format(k)}</kbd
				>
			{/each}
		</div>
	{/each}
</div>
