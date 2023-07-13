<script>
	import Textarea from "$components/ui/Textarea.svelte";
import Input from "$components/ui/Input.svelte";

</script>


<div contenteditable="false" class="rounded-lg focus-within:bg-red-400 p-4 border bg-card text-card-foreground shadow-sm max-w-sm">
    <Textarea on:click={(e) => {

    }}  contenteditable="false" value="test" />
</div>
