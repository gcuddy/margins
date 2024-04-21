<script lang="ts">
	import tailwind from '../app.css?inline';
	function mount(node: HTMLDivElement) {
		const style = document.createElement('style');
		const editedTailwind = tailwind.replace(':root', ':host');
		style.innerHTML = editedTailwind;
		node.append(style);
	}
</script>

<div use:mount>
	<slot />
</div>
