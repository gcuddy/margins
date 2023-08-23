<script lang="ts">
	import { page } from '$app/stores';
	import { IconPicker } from '$components/icon-picker';
	import { TagColorPill } from '$components/tags/tag-color';
	import { TagsCommandPopover } from '$components/tags/tag-command';
	import Badge from '$components/ui/Badge.svelte';

	// import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import Header from '$components/ui/Header.svelte';
	import Textarea from '$components/ui/Textarea.svelte';
	import Editor from '$components/ui/editor/Editor.svelte';
	import autosize from '$lib/actions/autosize';
	import { nanoid } from '$lib/nanoid';
	import { queryFactory } from '$lib/queries/querykeys';
	import { formatDate } from '$lib/utils/date';
	import { defaultParseSearch } from '$lib/utils/search-params';
	import { melt } from '@melt-ui/svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import type { JSONContent } from '@tiptap/core';
	import { onMount, tick } from 'svelte';
	import type { Snapshot } from './$types.js';
	import { updateAnnotationMutation } from '$lib/queries/mutations/index';
	import { Note } from '$components/notes';
	// import NoteSidebar from './NoteSidebar.svelte';
	export let data;

	let editor: Editor;

    let saved = false;

	const mutation = updateAnnotationMutation({
		showToast: true,
        onSuccess: () => {
            saved = true;
        }
	});

	let title = '';
	let textarea: HTMLTextAreaElement;
	let user = data .user_data?.username;

	let contentData: JSONContent = {
        type: 'doc',
        content: [
            {
                type: 'paragraph'
            }
        ]
    }

	export const snapshot: Snapshot = {
		capture: () => {
            if (saved) return;
			return {
				title,
				contentData
			};
		},
		restore: (snapshot) => {
			title = snapshot.title;
			contentData = snapshot.contentData;
		}
	};

</script>

<Note autofocus />
