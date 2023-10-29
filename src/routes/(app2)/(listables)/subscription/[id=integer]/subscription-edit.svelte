<script lang="ts">
	import { TagColorPill } from "$components/tags/tag-color";
	import { TagsCommandPopover } from "$components/tags/tag-command";
	import { Badge } from "$components/ui/badge";
	import { Button } from "$components/ui/button";
	import {DialogFooter} from "$components/ui/dialog";
      import * as Form from "$lib/components/ui/form";
	import { queryFactory } from "$lib/queries/querykeys";
	import { subscriptionUpdateInput } from "$lib/schemas/inputs/subscriptions.schema";
	import { melt } from "@melt-ui/svelte";
	import { createQuery } from "@tanstack/svelte-query";
	import { createEventDispatcher } from "svelte";
	import type { SuperValidated } from "sveltekit-superforms";

    export let form: SuperValidated<typeof subscriptionUpdateInput>;

        const dispatch = createEventDispatcher();

        // have to use tagsquery here to map over formvalues... not a huge fan of this
        const tagsQuery = createQuery(queryFactory.tags.list())
    </script>

<Form.Root class="contents" method="POST" {form} schema={subscriptionUpdateInput} let:config let:formValues let:formStore options={{
dataType: 'json',
}}>
    {@const tags = (formValues.data.tagIds ?? []).map(id => $tagsQuery.data?.find(tag => tag.id === id)).filter(Boolean)}
    <Form.Field {config} name="data.title">
      <Form.Item>
        <Form.Label>Name</Form.Label>
        <Form.Input autocomplete="off" type="text" data-1p-ignore />
        <Form.Validation />
      </Form.Item>
    </Form.Field>
    <!-- TODO: Stop enter from confirming here -->
    <div>
    <TagsCommandPopover selectedTags={tags} on:select={(e) => {
        const { selectedTags } = e.detail;
        formStore.update(store => {
            return {
                ...store,
                data: {
                    ...store.data,
                    tagIds: selectedTags.map(tag => tag.id)
                }
            }
        })
    }} let:builder>
        <div class="flex gap-1 flex-wrap" use:melt={builder}>
            {#each tags as tag}
                <!-- as="a" href="/tag/{tag.name}" to decide: should tehse be links or trigger popover? -->
                <Badge>
                    <TagColorPill invertDefault class="h-2 w-2 mr-1.5" color={tag.color} />
                    {tag.name}
                </Badge>
            {:else}
                + Tag
            {/each}
        </div>
            </TagsCommandPopover>
        </div>
    <!-- DialogFooter -->
    <DialogFooter>
        <slot name="footer" button={Form.Button}>
            <Button variant="outline" on:click={() => dispatch('cancel')}>Cancel</Button>
            <Form.Button>Save</Form.Button>
        </slot>
    </DialogFooter>
  </Form.Root>
