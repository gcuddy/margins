import type { EditorView } from '@tiptap/pm/view';
import { toast } from 'svelte-sonner';
import type { Editor } from 'svelte-tiptap';
import slugify from 'slugify';

/**
 * Handles Uploads to S3 on client side with toast notifications.
 * @param file File to upload
 * @param view Editor View from ProseMirror
 * @param event The event from the user
 */
export const handleImageUplaod = (
	file: File,
	view: EditorView,
	event: ClipboardEvent | DragEvent | Event
) => {
	const supported_types = ['image/', '/pdf'];

	// check if the file is an image
	console.log({ file });
	if (!supported_types.some((s) => file.type.includes(s))) {
		// TODO: Upload and insert as "attachment" (ala Obsidian)
		// For pdfs insert with pdfjs
		toast.error('File type not supported.');
	}
	// check if the file size is less than 50MB
	else if (file.size / 1024 / 1024 > 50) {
		toast.error('File size too big (max 50MB).');
	} else {
		toast.promise(
			fetch('/api/upload', {
				method: 'POST',
				headers: {
					'content-type': file?.type || 'application/octet-stream',
					filename: slugify(file.name) || 'image.png'
				},
				body: file
			}).then(async (res) => {
				console.log({ res });
				if (res.status === 200) {
					const json = (await res.json()) as { url: string };
					console.log({ json });
					const url = json.url;
					if (file.type.includes('image/')) {
						const image = new Image();
						console.log({ url });
						console.log({ image });
						image.src = url;
						image.onload = () => {
							insertImage(url);
						};
					} else if (file.type.includes('/pdf')) {
						// TODO
						console.log({ url });
						console.log({ view });
						return view.dispatch(
							view.state.tr.replaceSelectionWith(
								view.state.schema.nodes.iframe.create({
									src: url
								})
							)
						);
					}
				} else {
					throw new Error(`Error uploading image. Please try again.`);
				}
			}),
			{
				loading: 'Uploading image...',
				success: 'Image uploaded successfully.',
				error: (e) => {
					console.log(e);
					return e.message;
				}
			}
		);
	}
	const insertImage = (url: string) => {
		// for paste events
		if (event instanceof ClipboardEvent) {
			return view.dispatch(
				view.state.tr.replaceSelectionWith(
					view.state.schema.nodes.image.create({
						src: url,
						alt: file.name,
						title: file.name
					})
				)
			);

			// for drag and drop events
		} else if (event instanceof DragEvent) {
			const { schema } = view.state;
			const coordinates = view.posAtCoords({
				left: event.clientX,
				top: event.clientY
			});
			const node = schema.nodes.image.create({
				src: url,
				alt: file.name,
				title: file.name
			}); // creates the image element
			const transaction = view.state.tr.insert(coordinates?.pos || 0, node); // places it in the correct position
			return view.dispatch(transaction);

			// for input upload events
		} else if (event instanceof Event) {
			return view.dispatch(
				view.state.tr.replaceSelectionWith(
					view.state.schema.nodes.image.create({
						src: url,
						alt: file.name,
						title: file.name
					})
				)
			);
		}
	};
};

export const getPrevText = (
	editor: Editor,
	{
		chars,
		offset = 0
	}: {
		chars: number;
		offset?: number;
	}
) => {
	// for now, we're using textBetween for now until we can figure out a way to stream markdown text
	// with proper formatting: https://github.com/steven-tey/novel/discussions/7
	return editor.state.doc.textBetween(
		Math.max(0, editor.state.selection.from - chars),
		editor.state.selection.from - offset,
		'\n'
	);
	// complete(editor.storage.markdown.getMarkdown());
};

import { generateHTML } from '@tiptap/html';
import type { JSONContent } from '@tiptap/core';
import { generate_tiptap_extensions } from './extensions';
import { TiptapEditorProps } from './props';
import type { DocumentType } from '@prisma/client';
import { dequal } from 'dequal';
import { startingContentData } from './constants';

export function render_html(doc: JSONContent) {
	return generateHTML(doc, generate_tiptap_extensions());
}

export type NodeType<T> = {
	attrs: T;
};

// find deeply nested mention node in the document
export function findNodes<TType = JSONContent>(doc: JSONContent, type: string) {
	const nodes: JSONContent[] = [];
	function find(node: JSONContent) {
		if (node.type === type) {
			nodes.push(node);
		}
		if (node.content) {
			node.content.forEach(find);
		}
	}
	find(doc);
	return nodes as TType[];
}

export function save_srs_nodes(doc: JSONContent) {
	const nodes = findNodes(doc, 'srs') as {
		type: 'srs';
		attr: {
			// can I get this type from the schema?
			entry_id?: null | number;
			id: null | string;
			prompt: string | null;
			response: string | null;
		};
	}[];
	console.log({ nodes });
}

export function isJSONContent(content: unknown): content is JSONContent {
	/** dangerous - but yeh */
	return typeof content === 'object';
}

export function extractDataFromContentData(contentData: JSONContent) {
	const tags = findNodes<NodeType<{ id: number; name: string }>>(
		contentData,
		'tag',
	);
	// lol need to change that name...
	const links = findNodes<
		NodeType<{ title: string; id: number; type: DocumentType }>
	>(contentData, 'svelteCounterComponent');
	return {
		tags: tags.map((tag) => tag.attrs),
		links: links.map((link) => link.attrs),
	};
}

export function isBlankJsonContent(content: JSONContent) {
	// console.log('testing isblankjsoncontent', content, startingContentData);
	if (!content) {
		return true;
	}
	if (content?.content?.length === 0) {
		return true;
	}
	if (dequal(content, startingContentData)) {
		return true;
	}
	return false;
}
