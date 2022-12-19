<script lang="ts">
	export let size: 'xs' | 'sm' | 'base' = 'sm';
	let className = '';
	export { className as class };

	export let color: 'default' | 'muted' = 'default';
</script>

<span
	class="font-medium {size === 'xs'
		? 'text-xs'
		: size === 'sm'
		? 'text-sm'
		: 'text-base'} {color === 'muted' ? 'text-gray-500 dark:text-gray-400' : ''} {className}"
>
	<slot />
</span>
