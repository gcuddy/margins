<script lang="ts">
  import Input from '$components/ui/Input.svelte';
import type { NodeViewProps } from '@tiptap/core';
  import cx from 'classnames';
  import { NodeViewWrapper } from 'svelte-tiptap';
  import SRS from "../../../../../../routes/tests/playground/srs/+page.svelte";
	import MarkdownBox from '$components/MarkdownBox.svelte';

  export let node: NodeViewProps['node'];
  export let updateAttributes: NodeViewProps['updateAttributes'];
  export let selected: NodeViewProps['selected'] = false;

  const handleClick = (): void => {
    updateAttributes({ count: node.attrs.count + 1 });
  };
</script>

<NodeViewWrapper
  id="svelte-component"
  contenteditable="false"
  class="border-accent border-2 px-4 pb-4 my-4 rounded-sm flex flex-col max-w-prose"
>
<!-- TODO: Render Markdown with Latex -->
<MarkdownBox placeholder="Enter prompt here" />
<MarkdownBox placeholder="Enter response here" as="textarea" rows={1} />
</NodeViewWrapper>