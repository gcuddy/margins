<script lang="ts">
	export let size: 'xs' | 'sm' | 'base' = 'base';
	let className = '';
	export { className as class };
</script>

<span
	class="font-medium {size === 'xs'
		? 'text-xs'
		: size === 'sm'
		? 'text-sm'
		: 'text-base'} {className}"
>
	<slot />
</span>
