<script lang="ts">
	import { browser } from "$app/environment";
	import { invalidateAll } from "$app/navigation";
	import { page } from "$app/stores";
	import {
		TargetSchema,
		upsertAnnotation,
		type Selector,
	} from "$lib/annotation";
	import {
		createTextQuoteSelectorMatcher,
		describeRange,
		describeSelection,
		describeTextQuote,
	} from "$lib/annotator";
	import { highlightText } from "$lib/annotator/highlighter";
	import { makeCreateRangeSelectorMatcher } from "$lib/annotator/range";
	import type { TextQuoteSelector } from "$lib/annotator/types";
	import { nodeFromXPath } from "$lib/annotator/xpath";
	import FloatingAnnotation from "$lib/components/annotations/FloatingAnnotation.svelte";
	import ColorSwatch from "$lib/components/ColorSwatch.svelte";
	import ContextMenu from "$lib/components/ContextMenu.svelte";
	import EditHighlightToolTip from "$lib/components/EditHighlightToolTip.svelte";
	import HighlightToolTip from "$lib/components/HighlightToolTip.svelte";
	import ProseWrapper from "$lib/components/ProseWrapper.svelte";
	import TooltipMenu from "$lib/components/TooltipMenu.svelte";
	import { highlightElements } from "$lib/stores/misc";
	import { notifications } from "$lib/stores/notifications";
	import { selection } from "$lib/stores/selection";
	import { syncStore } from "$lib/stores/sync";
	import { trpc, trpcWithQuery } from "$lib/trpc/client";
	import type {
		AnnotationPos,
		NodeRef,
		SimplifiedHighlightSource,
		Tooltip as ITooltip,
	} from "$lib/types";
	import { finder } from "@medv/finder";
	import type { Annotation, Color, Tag } from "@prisma/client";
	import { onDestroy, onMount, tick } from "svelte";
	import { createPopperActions } from "svelte-popperjs";
	import { writable } from "svelte/store";
	import { reading_sidebar } from "$lib/features/entries/stores";
	import { createMutation, useQueryClient } from "@tanstack/svelte-query";
	import type { RouterInputs, RouterOutputs } from "$lib/trpc/router";
	import { entryDetailsQuery } from "$lib/features/entries/queries";
	import mq from "$lib/stores/mq";
	import { nanoid } from "$lib/nanoid";
	import type { JSONContent } from "@tiptap/core";
	import { findNodes } from "$lib/components/TipTap.svelte";
	const [menuRef, menuContent] = createPopperActions({
		placement: "top",
		strategy: "fixed",
		modifiers: [
			{
				name: "preventOverflow",
				options: {
					padding: {
						top: 75,
					},
				},
			},
			{
				name: "offset",
				options: {
					offset: [0, 16],
				},
			},
		],
	});
	const [annotationMenuRef, annotationMenuContent] = createPopperActions({
		placement: "top",
		strategy: "absolute",
		modifiers: [
			{
				name: "preventOverflow",
				options: {
					padding: {
						top: 75,
					},
				},
			},
			{
				name: "offset",
				options: {
					offset: [0, 8],
				},
			},
		],
	});
	const [popperRef, popperContent] = createPopperActions({
		placement: "right",
		modifiers: [
			{
				name: "offset",
				options: {
					offset: [-2, 0],
				},
			},
		],
	});
	const [imageTooltipRef, imageTooltipContent] = createPopperActions({
		placement: "top-end",
		modifiers: [
			{
				name: "offset",
				options: {
					offset: [-25, -50],
				},
			},
		],
	});
	export let entry: RouterOutputs["entries"]["load"];
	export let annotations = [];
	export let articleID: number;
	export let articleUrl: string;
	// export let annotations: Annotation[] = [];
	export let currentAnnotationColor: Color = "Yellow";

	$: currentAnnotationColor = active_annotation?.color || "Yellow";
	$: console.log({ currentAnnotationColor });
	export let showColors = false;
	export let readOnly = false;

	// Virtual Selection Element to track selection for annotation menu
	let show_tooltip = false;
	let tooltip_display: TooltipDisplay;
	let annotationContainer: HTMLElement;
	let rect: DOMRect = {
		x: 0,
		y: 0,
		bottom: 0,
		top: 0,
		width: 0,
		height: 0,
	} as DOMRect;
	$: getBoundingClientRect = () => {
		return {
			width: rect.width,
			height: rect.height,
			top: rect.top,
			bottom: rect.bottom,
			left: rect.x,
			right: rect.x,
			x: rect.x,
			y: rect.y,
			toJSON: () => ({ ...rect }),
		};
	};
	const virtualElement = writable({ getBoundingClientRect });
	$: $virtualElement = { getBoundingClientRect };
	menuRef(virtualElement);

	let destroy_popper: (() => void) | undefined;
	let show_link_tooltip = false;
	let show_image_tooltip = false;
	let destroy_image_tooltip: typeof destroy_popper;

	function cleanup() {
		if (destroy_image_tooltip) destroy_image_tooltip();
		if (destroy_popper) destroy_popper();
	}
	let link_tooltip_button: HTMLElement;

	// todo: should this be a reactive store?
	const idToElMap = new Map<
		string,
		{ destroy: (() => void)[]; els: HTMLElement[] }
	>();
	const annotation_els = writable<Record<number, HTMLElement>>();
	$: inlineAnnotations = annotations.filter((a) => a.type === "annotation");
	// when inlineannotations changes, re-render
	// $: inlineAnnotations, renderAnnotations();

	let active_highlight_el: HTMLElement;
	let active_highlight_rect: DOMRect;
	let active_highlight_id: string | null = null;
	$: console.log({ active_highlight_id });
	$: active_annotation = annotations?.find(
		({ id }) => id === active_highlight_id
	);
	let active_annotation_tags: (typeof annotations)[number]["tags"] = [];
	$: active_annotation_tags = active_annotation?.tags || [];
	let annotation_opts: {
		el: HTMLElement;
		value: string | JSONContent;
		html?: string;
		annotation: Annotation;
		highlightInfo?: Awaited<ReturnType<typeof highlightSelectorTarget>>;
		selector: Awaited<TextQuoteSelector>;
		tags?: { name: string; id?: number }[];
		color: string;
	} | null = null;

	const createTextQuoteMatcher = (selector: TextQuoteSelector) => {
		return () => createTextQuoteSelectorMatcher(selector);
	};
	// Not sure if this is a performant way to do this...
	function updateActiveAnnotation() {
		wrapper
			.querySelectorAll(`[data-annotation-id="${active_highlight_id}"]`)
			?.forEach((el) => {
				el.classList.add("active");
			});
		// remove active class from all other annotations
		Array.from(wrapper.querySelectorAll("[data-annotation-id]")).forEach(
			(el) => {
				if (el.dataset.annotationId !== active_highlight_id?.toString()) {
					el.classList.remove("active");
				}
			}
		);
	}

	$: active_highlight_id, wrapper && updateActiveAnnotation();

	// TODO: add more elements beyond just images, such as videos, iframes, etc.
	let images: HTMLImageElement[] = [];

	let centerOfWrapper: number;

	let wrapper: HTMLElement;
	let wrapper_dimensions: DOMRect;
	let highlighter: Highlighter;
	let validSelection = false;

	const highlight_ids: number[] = [];

	let pending_highlight: HighlightBody | undefined;

	const annotationTooltip: ITooltip = {
		visible: false,
		top: 0,
	};

	let highlightMenu = false;
	let highlightMenuTop = 0;
	let highlightMenuLeft = 0;

	let tooltipVisible = false;
	let tooltipTop = 0;
	let tooltipLeft = 0;

	const queryClient = useQueryClient();
	const entryQueryKey = entryDetailsQuery({ id: articleID }).queryKey;

	const client = trpcWithQuery($page);
	const utils = client.createContext();

	function createAnnotation(
		data: Partial<RouterOutputs["entries"]["load"]["annotations"][number]>
	): RouterOutputs["entries"]["load"]["annotations"][number] {
		return {
			id: data.id || nanoid(),
			createdAt: new Date(),
			updatedAt: new Date(),
			editedAt: null,
			deleted: null,
			userId: $page.data.user?.id as string,
			parentId: null,
			sortOrder: 0,
			bookmarkId: null,
			type: "annotation",
			body: "",
			contentData: null,
			chosenIcon: null,
			title: null,
			private: false,
			target: null,
			entryId: articleID,
			color: "Yellow",
			creator: {
				username: $page.data.user?.username || "",
			},
			children: [],
			...data,
		};
	}

	// REVIEW: not a huge advantage to using trpc.query here as opposed to just using createmutation hook from svelte-query
	// set this in context above so it can be accessed by readingsidebar without repetition
	const saveMutation = client.annotations.save.createMutation({
		onMutate: (data) => {
			// utils.entries.load.setData(
			// 	{
			// 		id: articleID,
			// 	},
			// 	(old) => {
			// 		console.log({ old, data });
			// 		return old;
			// 	}
			// );
			// // return;
			if (data.id) {
				// optimstically update the cache for this entry
				// optimistic update: TODO cancel?
				// snapshot
				const previous = utils.entries.load.getData();
				// optimstically update
				utils.entries.load.setData(
					{
						id: articleID,
					},
					(old) => {
						if (!old) return old;
						// either update or add
						const existing = old.annotations.find((a) => a.id === data.id);
						if (!existing) {
							return {
								...old,
								annotations: [
									...old.annotations,
									{
										...createAnnotation(data),
										...data,
									},
								],
							};
						}
						return {
							...old,
							annotations: old.annotations.map((a) => {
								if (a.id === data.id) {
									return {
										...a,
										...data,
									};
								}
								return a;
							}),
						};
					}
				);
			}
		},
		onSuccess: () => {
			utils.entries.load.invalidate({
				id: articleID,
			});
			utils.entries.listBookmarks.invalidate();
		},
	});

	const createRelation = client.entries.createRelation.createMutation({
		onMutate: (data) => {
			// utils.client.entries.load.
			const entry = utils.entries.load.getData({
				id: articleID,
			});
			const entryIds = Array.isArray(data.entryId)
				? data.entryId
				: [data.entryId];
		},
		onSuccess: () => {
			utils.entries.load.invalidate({
				id: articleID,
			});
			// utils.entries.listBookmarks.invalidate();
		},
	});

	type AnnotationMutation = {
		// TODO
	};

	const saveAnnotation = createMutation({
		mutationFn: (input: RouterInputs["annotations"]["save"]) =>
			trpc($page).annotations.save.mutate({
				entryId: articleID,
				...input,
			}),
		onMutate: (data) => {
			const { id } = data;
			if (!id) return;
			// then optimsitically update the cache
			// todo: cancel?
			// snapshot
			const previous = utils.entries.load.getData({ id: articleID });
			// update
			utils.entries.load.setData(
				{
					id: articleID,
				},
				(old) => {
					console.log({ old, data });
					if (!old) return old;
					const idx = old.annotations.findIndex((a) => a.id === id);
					console.log({ idx });
					if (idx === -1) {
						// then  add
						const annotation = createAnnotation(data);
						console.log({ annotation });
						return {
							...old,
							annotations: [...old.annotations, annotation],
						};
					} else {
						console.log({ old, data });
						// then update
						const updated = {
							...old,
							annotations: [
								...old.annotations.map((a) => {
									if (a.id === id) {
										return {
											...a,
											...data,
										};
									}
									return a;
								}),
							],
						};
						console.log({ updated });
						return { ...updated };
					}
				}
			);
			tick().then(() => {
				// scroll into view
				setTimeout(() => {
					const el = document.querySelector(
						`[data-sidebar-annotation-id="${id}"]`
					);
					// debugger;
					console.log({ el });
					el?.scrollIntoView({ behavior: "smooth" });
				}, 100);
				// const el = document.querySelector(`[data-sidebar-annotation-id="${id}"]`);
				// console.log({el})
				// el?.scrollIntoView({ behavior: "smooth" });
			});
			return { previous };
		},
		onError: (err, newAnnotation, context) => {
			// roll back
			if (context?.previous) {
				utils.entries.load.setData(
					{
						id: articleID,
					},
					context.previous
				);
			}
			console.error(err);
			notifications.notify({
				title: "Error",
				message: "There was an error saving your annotation",
				type: "error",
			});
			console.log({ newAnnotation });
			// TODO: save annotation to localstorage/idb
		},
		onSettled: () => {
			// Always refetch after error or success:
			utils.entries.load.invalidate({
				id: articleID,
			});
			utils.entries.listBookmarks.invalidate();
			utils.annotations.invalidate();
			// queryClient.invalidateQueries({
			// 	queryKey: entryQueryKey,
			// });
			// queryClient.invalidateQueries({
			// 	queryKey: ["annotations"],
			// });
		},
	});
	const deleteAnnotation = client.annotations.delete.createMutation({
		onMutate: (id) => {
			utils.entries.load.setData(
				{
					id: articleID,
				},
				(old) => {
					if (!old) return old;
					return {
						...old,
						annotations: old.annotations.filter((a) => a.id !== id),
					};
				}
			);
		},
		onSuccess: () => {
			utils.entries.load.invalidate({
				id: articleID,
			});
			utils.entries.listBookmarks.invalidate();
			utils.annotations.invalidate();
		},
		onError: () => {
			notifications.notify({
				title: "Error",
				message: "There was an error deleting your annotation",
				type: "error",
			});
		},
	});

	const isValidSelection = (sel: Selection) =>
		sel &&
		!sel.isCollapsed &&
		sel.rangeCount > 0 &&
		sel.containsNode(wrapper, true) &&
		!sel.anchorNode.parentElement.closest("mark[data-annotation-id]") &&
		!sel.focusNode.parentElement.closest("mark[data-annotation-id]");

	const unsubscribeSelection = selection.subscribe((val) => {
		if (!val) return;
		if (!wrapper) return;
		if (!$page.data.authorized) return;
		console.log({ val });
		const { selection: sel } = val;
		if (sel && isValidSelection(sel)) {
			console.log("VALID");
			validSelection = true;
			tooltipVisible = true;
			show_tooltip = true;
			tooltip_display = TooltipDisplay.New;
			rect = sel.getRangeAt(0).getBoundingClientRect();
		} else {
			console.log("INVALID");
			// if it's in a combobox
			if (document.activeElement instanceof HTMLInputElement) return;
			// show_tooltip = false;
			validSelection = false;
			tooltipVisible = false;
		}
		// if (validSelection && val.rect) {
		// 	console.log({ scrollY: window.scrollY, rect: val.rect });
		// 	console.log({ $mainEl });
		// 	tooltipTop = val.rect.top + $mainEl.scrollTop - 36;
		// 	console.log({ tooltipTop });
		// 	tooltipLeft = val.rect.left + val.rect.width / 2 - 40;
		// 	annotationTooltip.top = val.rect.top + $mainEl.scrollTop;
		// }
		return;
	});

	enum TooltipDisplay {
		New,
		Edit,
	}
	const createHighlightBody = (
		highlight: SimplifiedHighlightSource,
		input: Range | string,
		nonTextNodes: NodeRef[] = []
	) => {
		console.log("creating highlight body");
		const highlightBody: HighlightBody = {
			articleID,
			highlight,
			// sanitizedHtml: sanitize(input),
			nonTextNodes,
		};
		return highlightBody;
	};

	const preventDefault = (e: Event) => e.preventDefault();

	const wrapNonTextNode = (element: HTMLElement, highlightId: string) => {
		// const wrapper = document.createElement('div');
		// wrapper.classList.add('highlight-node');
		// wrapper.dataset.highlightId = highlightId;
		// element.parentNode.insertBefore(wrapper, element);
		// wrapper.appendChild(element);
		// return wrapper;
		// wrapping seems to have weird behavior, so we just use the element itself
		element.dataset.highlightId = highlightId;
		element.classList.add("highlight-node");
		element.addEventListener("click", preventDefault);
	};
	const unWrapNonTextNode = (element: HTMLElement, highlightId: string) => {
		element.dataset.highlightId = "";
		element.classList.remove("highlight-node");
		element.removeEventListener("click", preventDefault);
	};

	const restoreHighlightedNonTextNode = (
		node: NonTextNode,
		highlightId: string
	) => {
		let element: HTMLElement;
		element = document.querySelector(node.selector);
		if (!element)
			element = document.getElementsByTagName(node.tagName)[
				node.index
			] as HTMLElement;
		if (!element) {
			throw Error(`Could not find element with selector ${node.selector}`);
		}
		// element.dataset.highlightId = highlightId;
		// element.classList.add('highlight-node');
		wrapNonTextNode(element, highlightId);
	};

	const removeNonTextNodes = (id: string) => {
		const nodes = document.querySelectorAll<HTMLElement>(
			`[data-highlight-id="${id}"]`
		);
		nodes.forEach((node) => unWrapNonTextNode(node, id));
	};

	const isHighlight = (target: HTMLElement) =>
		target.dataset &&
		target.dataset.annotationId &&
		annotations.some(
			(a) => a.id === parseInt(target.dataset.annotationId as string)
		);

	const isAnnotation = (target: HTMLElement) =>
		!target.closest(".floating-annotation") &&
		(target.closest("[data-annotation-id]") as HTMLElement) &&
		target.tagName !== "BUTTON";
	function handleClick(e: MouseEvent) {
		if (!$page.data.authorized) return;
		const el = e.target as HTMLElement;
		console.log({ el });
		const annotationParent = isAnnotation(el);
		if (annotationParent) {
			console.log("annotation");
			// active_highlight_rect = annotationParent.getBoundingClientRect();
			active_highlight_el = el;
			active_highlight_id = el.dataset.annotationId as string;
			rect = el.getBoundingClientRect();
			const active_annotation = annotations.find(
				(a) => a.id === active_highlight_id
			);
			const { selector } = TargetSchema.parse(active_annotation?.target);
			tooltip_display = TooltipDisplay.Edit;
			show_tooltip = true;
			// annotation_opts = {
			// 	el: annotationParent,
			// 	value: (active_annotation?.body as string) || '',
			// 	selector,
			// };
		} else if (annotation_opts === null) {
			active_highlight_id = null;
			show_tooltip = false;
		}
	}

	const createFloatingAnnotation = (top: number, el: HTMLElement) => {
		console.log({ top });
		annotationTooltip.top = top;
		annotationTooltip.visible = true;

		const floatingAnnotation: AnnotationPos = {
			pos: top / wrapper.getBoundingClientRect().height,
			node: {
				tagName: el.tagName,
				index: Array.from(wrapper.getElementsByTagName(el.tagName)).indexOf(el),
				selector: finder(el),
			},
		};
		console.log({ floatingAnnotation });
	};

	const updateHighlightElements = () =>
		highlightElements.set(highlighter.getDoms());

	async function describeCurrentSelection() {
		const userSelection = window.getSelection()?.getRangeAt(0);
		if (!userSelection || userSelection.collapsed) return;
		return await describeTextQuote(userSelection);
	}
	const highlight: typeof highlightText = (
		match,
		tagName = "mark",
		attributes
	) => {
		return highlightText(match, tagName, {
			...attributes,
		});
	};
	const createMatcher = (selector: Selector) => {
		const innerCreateMatcher = {
			TextQuoteSelector: createTextQuoteSelectorMatcher,
			RangeSelector: makeCreateRangeSelectorMatcher(createMatcher as any),
			XPathSelector: null,
		}[selector.type];
		if (!innerCreateMatcher) {
			throw new Error(`Unsupported selector type: ${selector.type}`);
		}
		return innerCreateMatcher(selector);
	};
	async function highlightSelectorTarget(
		textQuoteSelector: TextQuoteSelector,
		id?: number,
		attributes?: Record<string, string>,
		annotation = false
	) {
		const matches = createTextQuoteSelectorMatcher(textQuoteSelector)(wrapper);

		// Modifying the DOM while searching can mess up; see issue #112.
		// Therefore, we first collect all matches before highlighting them.
		const matchList = [];
		for await (const match of matches) matchList.push(match);
		console.log({ matchList });
		return matchList.map((match) =>
			highlight(match, "mark", {
				"data-annotation-id": id?.toString() || "",
				...attributes,
			})
		);
	}

	const makeHTMLFromRange = (range: Range): string => {
		const cloned = range.cloneContents();
		const div = document.createElement("div");
		div.appendChild(cloned);
		return div.outerHTML;
		// could also return inner, but I like having the wrapping div
	};
	const tryToWrapOnServer = async () => {
		for (const annotation of inlineAnnotations) {
			console.log({ annotation });
			try {
				const target = TargetSchema.parse(annotation.target);
				console.log({ target });
				const { selector } = target;
				const matches = createMatcher(selector)(wrapper);
				const matchList = [];
				for await (const match of matches) matchList.push(match);
				const h = matchList.map((match) =>
					highlight(match, "mark", {
						"data-annotation-id": annotation.id.toString(),
						"data-annotation-content":
							annotation.body ||
							annotation.contentData ||
							annotation.tags.length
								? "true"
								: "false",
					})
				);
				$annotation_els = {
					...$annotation_els,
					[annotation.id]: h[0].highlightElements[0],
				};
				idToElMap.set(annotation.id, {
					destroy: h.map((h) => h.removeHighlights),
					els: h.flatMap((h) => h.highlightElements),
				});
			} catch (e) {
				// console.error(e);
			}
		}
	};

	async function __renderAnnotations() {
		console.log(`rendering annotations`);
		if (!wrapper) return;

		for (const annotation of inlineAnnotations) {
			try {
				// check if exists
				if (document.querySelector(`[data-annotation-id="${annotation.id}"]`))
					continue;
				const target = TargetSchema.parse(annotation.target);
				console.log({ target });
				const { selector } = target;
				const matches = createMatcher(selector)(wrapper);
				console.log({ matches });
				const matchList = [];
				for await (const match of matches) matchList.push(match);
				const h = matchList.map((match) =>
					highlight(match, "mark", {
						"data-annotation-id": annotation.id.toString(),
						"data-annotation-content":
							annotation.body ||
							annotation.contentData ||
							annotation.tags?.length
								? "true"
								: "false",
					})
				);
				$annotation_els = {
					...$annotation_els,
					[annotation.id]: h[0].highlightElements[0],
				};
				idToElMap.set(annotation.id, {
					destroy: h.map((h) => h.removeHighlights),
					els: h.flatMap((h) => h.highlightElements),
				});
			} catch (e) {
				// console.error(e);
			}
		}
		// remove old ones that don't exist

		const ids = inlineAnnotations.map((i) => i.id);
		console.log({ idToElMap });
		const keysToDelete = Array.from(idToElMap.keys()).filter(
			(key) => !ids.includes(key)
		);
		keysToDelete.forEach((key) => {
			idToElMap.get(key)?.destroy.forEach((d) => d());
			idToElMap.delete(key);
			const els = wrapper?.querySelectorAll(`[data-annotation-id="${key}"]`);
			els.forEach((el) => {
				if (!(el instanceof HTMLElement)) return;
				const id = +(el.dataset.annotationId || "");
				el.remove();
				// if (!ids.includes(id)) {
				// 	// hm! probably doesn't exist!
				// 	console.log(`removing`, { el });
				// 	el.remove();
				// }
			});
		});
	}

	async function renderAnnotations() {
		console.log("rendering annotations");
		for (const annotation of inlineAnnotations) {
			console.log({ annotation });
			try {
				const target = TargetSchema.parse(annotation.target);
				console.log({ target });
				const { selector } = target;
				const matches = createMatcher(selector)(wrapper);
				console.log({ matches });
				const matchList = [];
				for await (const match of matches) matchList.push(match);
				const h = matchList.map((match) =>
					highlight(match, "mark", {
						"data-annotation-id": annotation.id.toString(),
						"data-annotation-content":
							annotation.body ||
							annotation.contentData ||
							annotation.tags?.length
								? "true"
								: "false",
						"data-annotation-color": annotation.color,
					})
				);
				$annotation_els = {
					...$annotation_els,
					[annotation.id]: h[0].highlightElements[0],
				};
				idToElMap.set(annotation.id, {
					destroy: h.map((h) => h.removeHighlights),
					els: h.flatMap((h) => h.highlightElements),
				});
			} catch (e) {
				console.error(e);
			}
		}
	}

	$: entry.id && renderAnnotations();
	onMount(async () => {
		console.log("running on mount");
		if (wrapper) {
			console.log({ inlineAnnotations });
			// load highlgihts
			await renderAnnotations();
			// TODO: eventually this will be ssr-d so we'll be able to go to annotation without js, just a #annotation-{ID} link
			const a = $page.url.searchParams.get("a");
			if (a && wrapper) {
				console.log("a", { a });
				// go to the annotation
				setTimeout(() => {
					const el = wrapper.querySelector(`[data-annotation-id="${a}"]`);
					el?.scrollIntoView({
						block: "center",
						behavior: "smooth",
					});
				}, 0);
			}
			if ($page.data.AUTHORIZED) {
				const links = Array.from(wrapper.querySelectorAll("a"));
				// setUpLinkDragHandlers(links, { url: articleUrl, id: articleID });
			}
		}
	});
	onDestroy(() => {
		unsubscribeSelection();
		highlighter && highlighter.dispose();
	});
</script>

<div on:focus>
	<!-- REVIEW: positoning of swatch when zoomed out -->
	<div
		style:--translate={$reading_sidebar.active
			? `${$reading_sidebar.width + 36}px`
			: undefined}
		class="fixed transition {show_tooltip &&
		tooltip_display === TooltipDisplay.New
			? '-translate-y-0 opacity-75 transition hover:opacity-100'
			: 'translate-y-8 opacity-0'} bottom-3 right-6 {$reading_sidebar.active
			? '-translate-x-[var(--translate)]'
			: ''} flex h-6  items-center justify-end rounded-lg transition duration-100 {showColors
			? ''
			: ''}"
	>
		{#each [{ name: "Yellow", hex: "#facd5a" }, { name: "Green", hex: "#7bc868" }, { name: "Blue", hex: "#6ab0f2" }, { name: "Pink", hex: "#fb5c88" }, { name: "Purple", hex: "#c885da" }] as { hex, name }, index}
			{@const selected = currentAnnotationColor === name}
			{@const size = 36}
			{@const translate = -1 * (((5 - (index + 1)) * (size * 1) * 5) / 5)}
			<ColorSwatch
				--z-index={selected ? 2 : 1}
				--translate={showColors ? `${translate}px` : `0px`}
				--swatchSize="36px"
				on:click={(e) => {
					if (showColors) {
						// @ts-ignore
						currentAnnotationColor = name;
						//@ts-ignore
						e.target?.focus();
					}
					showColors = !showColors;
				}}
				class="absolute z-[var(--z-index)] translate-y-[var(--translate)] {selected} transition {!showColors &&
				selected
					? ''
					: ''}"
				{hex}
				{selected}
				checkmark={false}
			/>
		{/each}
	</div>
	{#if show_tooltip}
		<div
			class="z-40 mobile:!fixed mobile:!bottom-4 mobile:!left-0 mobile:!right-0 mobile:!mx-auto mobile:!transform-none "
			use:menuContent
		>
			{#if showColors}
				<!-- <Swatches
					bind:selected={currentAnnotationColor}
					colors={[
						{
							name: "yellow",
							hex: "#facc15",
						},
						{
							name: "red",
							hex: "#ef4444",
						},
						{
							name: "green",
							hex: "#22c55e",
						},
						{
							name: "purple",
							hex: "#a855f7",
						},
						{
							name: "blue",
							hex: "#3b82f6",
						},
					]}
					class="mb-0.5 rounded-lg bg-black p-0.5"
				/> -->
			{:else}
				<!-- <button class="flex justify-end" on:click={() => (showColors = true)}>
					<Icon name="ellipsisHorizontalCircleMini" className="h-5 w-5 dark:fill-gray-300/50" />
				</button> -->
			{/if}

			<TooltipMenu>
				{#if tooltip_display === TooltipDisplay.New}
					<HighlightToolTip
						color={currentAnnotationColor}
						labels={true}
						on:close={() => {
							console.log("close");
							show_tooltip = false;
						}}
						on:annotate={async () => {
							const userSelection = window.getSelection();
							if (!userSelection) return;
							const userRange = userSelection.getRangeAt(0);
							const html = makeHTMLFromRange(userRange);
							console.log({ userSelection: userRange });
							if (!userRange || userRange.collapsed) return;
							const selector = await describeTextQuote(userRange);
							console.time("described");
							const described = await describeSelection(userRange, wrapper);
							console.timeEnd("described");
							console.log({ described });
							if (described?.type === "TextQuoteSelector") {
								const highlightInfo = await highlightSelectorTarget(
									selector,
									undefined,
									{
										"data-annotation": "true",
										"data-annotation-id": "undefined",
										"data-annotation-content": "true",
										"data-annotation-color": currentAnnotationColor,
									},
									true
								);
								const el = [
									...highlightInfo[highlightInfo.length - 1]?.highlightElements,
								].pop();
								console.log({ highlightInfo });
								if (!el) return;
								// rect = el.getBoundingClientRect();
								annotationMenuRef(el);
								annotation_opts = {
									el,
									value: "",
									highlightInfo,
									selector,
									html,
									color: currentAnnotationColor,
								};
							} else if (described?.type === "RangeSelector") {
								// TODO: allow other matchers besides text quote and fix type error
								const createRangeSelectorMatcher =
									makeCreateRangeSelectorMatcher(
										createTextQuoteSelectorMatcher
									);
								const match = createRangeSelectorMatcher(described)(wrapper);
								const matches = [];
								for await (const range of match) {
									matches.push(range);
								}
								const highlightInfo = matches.map((match) => highlight(match));
								const el = [
									...highlightInfo[highlightInfo.length - 1]?.highlightElements,
								].pop();
								console.log({ highlightInfo });
								if (!el) return;
								// rect = el.getBoundingClientRect();
								annotationMenuRef(el);
								annotation_opts = {
									el,
									value: "",
									highlightInfo,
									selector,
								};
							} else if (described?.type === "XPathSelector") {
								const node = nodeFromXPath(described.value);
								console.log({ node });
								if (node) {
									const highlightInfo = highlight(node);
									const el = [...highlightInfo.highlightElements].pop();
									if (!el) return;
									annotationMenuRef(el);
									annotation_opts = {
										el,
										value: "",
									};
								}
							}
							show_tooltip = false;
						}}
						on:highlight={async () => {
							const userSelection = window.getSelection()?.getRangeAt(0);
							if (!userSelection || userSelection.collapsed) return;
							const selector = await describeTextQuote(userSelection);
							try {
								const id = nanoid();
								const highlightInfo = await highlightSelectorTarget(
									selector,
									undefined,
									{
										"data-annotation": "true",
										"data-annotation-id": id,
										"data-annotation-content": "false",
										"data-annotation-color": currentAnnotationColor,
									},
									true
								);
								$saveAnnotation.mutate({
									target: {
										source: articleUrl,
										selector,
									},
									color: currentAnnotationColor,
									id,
								});
								window.getSelection()?.removeAllRanges();
								show_tooltip = false;
								highlightInfo.forEach((h) => {
									h.highlightElements.forEach((el) => {
										el.setAttribute("id", `annotation-${id}`);
										el.setAttribute("data-annotation-id", id.toString());
									});
								});
								idToElMap.set(id, {
									destroy: highlightInfo.map((h) => h.removeHighlights),
									els: highlightInfo.flatMap((h) => h.highlightElements),
								});
							} catch (e) {
								console.error(e);
								notifications.notify({
									type: "error",
									message: "Highlight failed!",
								});
								highlightInfo.forEach((h) => {
									h.removeHighlights();
								});
							}
						}}
					/>
				{:else if tooltip_display === TooltipDisplay.Edit}
					<EditHighlightToolTip
						on:delete={async () => {
							if (active_annotation?.body || active_annotation?.contentData) {
								// confirm
								const c = window.confirm("Are you sure you want to delete?");
								if (!c) return;
							}
							console.log({ active_highlight_id });
							if (active_highlight_id === null) return;
							show_tooltip = false;
							const removeHighlights = idToElMap.get(active_highlight_id);
							removeHighlights &&
								removeHighlights.destroy.forEach((remove) => remove());
							console.log({ removeHighlights });
							// clean up button
							document
								.querySelectorAll(
									`[data-annotation-id="${active_highlight_id}"]`
								)
								?.forEach((el) => {
									el.remove();
								});

							highlightMenu = false;
							idToElMap.delete(active_highlight_id);
							annotations = annotations.filter(
								(a) => a.id !== active_highlight_id
							);
							$deleteAnnotation.mutate(active_highlight_id);
						}}
						on:edit={() => {
							show_tooltip = false;
							const target = TargetSchema.parse(active_annotation?.target);
							if (typeof target === "string") return;
							annotation_opts = {
								el: active_highlight_el,
								value:
									active_annotation?.body ||
									active_annotation?.contentData ||
									"",
								selector: target.selector,
							};
						}}
						annotation={active_annotation}
						on:color={async ({ detail: color }) => {
							console.log({
								active_annotation,
								active_highlight_id,
								annotations,
							});
							const idx = annotations.findIndex(
								(a) => active_annotation?.id === a.id
							);
							console.log({ idx });
							if (idx === -1) {
								throw new Error("Error finding active_annotation");
							}
							// optimistic update
							// annotations[idx] = { ...annotations[idx], color };
							const els = wrapper?.querySelectorAll(
								`[data-annotation-id="${annotations[idx].id}"]`
							);
							els.forEach((el) => {
								if (el instanceof HTMLElement) {
									el.dataset.annotationColor = color;
								}
							});
							// send to trpc to update
							$saveAnnotation.mutate({
								id: annotations[idx].id,
								color,
							});
							// await trpc().annotations.save.mutate({
							// 	id: annotations[idx].id,
							// 	color,
							// });
							// await invalidateAll();
						}}
						on:annotate={() => {
							highlightMenu = false;
							show_tooltip = false;
							const target = TargetSchema.parse(active_annotation?.target);
							if (typeof target === "string") return;
							annotation_opts = {
								el: active_highlight_el,
								value: active_annotation?.body || "",
								selector: target.selector,
							};
						}}
					/>
				{/if}
			</TooltipMenu>
		</div>
		<!-- <AnnotationColorSelector /> -->
	{:else if show_tooltip && !$mq.desktop}
		<div class="fixed bottom-0 left-0 right-0 z-50">
			<div
				class="flex
                items-center
                justify-center
                rounded
                bg-white
                p-2
                text-sm
                text-gray-700
                shadow
                "
			>
				<div class="flex items-center">
					<div class="mr-2">
						<svg
							class="h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<div class="mr-2">
						<span>Highlight</span>
					</div>
				</div>
			</div>
		</div>
	{/if}
	{#if annotation_opts !== null}
		<div
			bind:this={annotationContainer}
			style:--min-width="300px"
			data-annotation-entry
		>
			<FloatingAnnotation
				rich={true}
				size="base"
				tags={active_annotation_tags}
				on:cancel={() => {
					if (!annotation_opts) return;
					console.log({ annotation_opts });
					annotation_opts.highlightInfo?.forEach((h) => {
						// e;
						h.removeHighlights();
					});
					annotation_opts = null;
				}}
				on:save={async (e) => {
					console.log({ e });
					if (!annotation_opts || !$page.data.user) return;
					const tagsChanged =
						JSON.stringify(active_annotation_tags) !==
						JSON.stringify(e.detail.tags);
					console.log({ tagsChanged });
					const { value, tags } = e.detail;
					if (typeof value === "object") {
						const mentionNodes = findNodes(value, "mention");
						const mentionNodesToAdd = mentionNodes.filter((node) => {
							const { id } = node;
							return (
								entry.relations.some((r) => r.relatedEntry?.id === id) === false
							);
						});
						console.log({ mentionNodesToAdd });
						for (const node of mentionNodesToAdd) {
							if (!node.attrs?.id) continue;
							$createRelation.mutate({
								entryId: articleID,
								relatedEntryId: node.attrs.id,
							});
						}
					}
					console.log({ value });
					const { selector, highlightInfo, el } = annotation_opts;
					console.log({ annotation_opts });
					console.log({ idToElMap });
					const id =
						el.dataset.annotationId && el.dataset.annotationId !== "undefined"
							? el.dataset.annotationId
							: nanoid();
					$saveAnnotation.mutate({
						entryId: articleID,
						target: {
							source: articleUrl,
							selector,
							html: annotation_opts.html,
						},
						body: typeof value === "string" ? value : undefined,
						contentData: typeof value === "object" ? value : undefined,
						color: currentAnnotationColor,
						id,
						tags,
					});
					annotation_opts = null;
					if (highlightInfo) {
						console.log({ highlightInfo });
						highlightInfo?.forEach((h) => {
							h.highlightElements.forEach((el) => {
								console.log({ el });
								el.setAttribute("id", `annotation-${id}`);
								el.setAttribute("data-annotation-id", id.toString());
							});
						});
						$annotation_els = {
							...$annotation_els,
							[id]: highlightInfo[0].highlightElements[0],
						};
						idToElMap.set(id, {
							destroy: highlightInfo.map((h) => h.removeHighlights),
							els: highlightInfo.flatMap((h) => h.highlightElements),
						});
					} else {
						// get from idToElMap
						const els = idToElMap.get(id)?.els;
						console.log({ value });
						if (els) {
							els.forEach((el) => {
								el.setAttribute(
									"data-annotation-content",
									!!value ? "true" : "false"
								);
							});
						}
					}
					if (typeof value === "object") {
						// TODO: look for links, add relations
					}
				}}
				{...annotation_opts}
			/>
		</div>
	{/if}
	<ProseWrapper
		bind:dimensions={wrapper_dimensions}
		bind:el={wrapper}
		on:click={handleClick}
		first_letter={false}
	>
		<div
			class="!select-text"
			on:dragstart={(e) => {
				if (e.target instanceof HTMLAnchorElement) {
					// set context data
					console.log({ articleUrl, articleID });
					e.dataTransfer?.setData("context/url", articleUrl);
					e.dataTransfer?.setData("context/entryId", articleID.toString());
				}
			}}
		>
			<slot />
		</div>
	</ProseWrapper>
</div>
{#if show_image_tooltip}
	<div use:imageTooltipContent>
		<ContextMenu
			strategy="absolute"
			items={[
				[
					{
						icon: "academicCap",
						label: "save",
					},
				],
			]}
			active_styling={false}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-10 w-10 fill-black/25 stroke-amber-500"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
		</ContextMenu>
	</div>
{/if}

<style lang="postcss">
	:global(mark) {
		scroll-padding-top: 100px;
	}
	/* :global(mark[data-annotation-id]) {
		cursor: pointer;
		@apply relative animate-saturate-pulse scroll-mt-48 rounded-sm bg-yellow-200 transition dark:border-yellow-500 dark:bg-yellow-900/90 dark:text-amber-50;
	} */
	/* maybe broder should just be applied if there's an annotation attached */
	/* :global(mark[data-annotation-id][data-annotation-content="true"]) {
		@apply border-b-2 border-yellow-400;
	}
	:global(mark[data-annotation-id][data-annotation-color="Yellow"].active) {
		@apply bg-yellow-400 dark:bg-yellow-500;
	}
	:global(mark[data-annotation-id][data-annotation-color="Green"].active) {
		@apply bg-green-400 dark:bg-green-500;
	}
	:global(mark[data-annotation-id][data-annotation-color="Pink"].active) {
		@apply bg-pink-400 dark:bg-pink-500;
	}
	:global(mark[data-annotation-id][data-annotation-color="Purple"].active) {
		@apply bg-purple-400 dark:bg-purple-500;
	}
	:global(mark[data-annotation-id][data-annotation-color="Blue"].active) {
		@apply bg-blue-400 dark:bg-blue-500;
	}
	:global(.dark mark[id]) {
		@apply bg-yellow-200/20 text-amber-200;
	}
	:global(mark[data-annotation-id] img) {
		@apply border-4 border-primary-400;
	} */

	/* :global(mark[data-annotation-color="Green"]) {
		background-color: var(--highlight-green);
	} */
	/* :global(mark[data-annotation-color]) {
		@apply bg-[var(--annotationColor)];
	} */
	/* :global(mark[data-annotation-color="Yellow"]) {
		@apply bg-[var(--highlight-yellow)]  dark:bg-highlight-yellow-dark/40;
	} */
</style>
