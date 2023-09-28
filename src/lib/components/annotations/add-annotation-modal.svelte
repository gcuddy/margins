<script lang="ts">
	import Editor from '$components/ui/editor/Editor.svelte';
	import { Input } from '$components/ui/input';

	export let type: 'timestamp' = 'timestamp';
</script>

<!-- <Editor /> -->


<Input type="text" label="Title" />

<Editor />
