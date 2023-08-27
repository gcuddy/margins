import type { TargetSchema } from '$lib/annotation';
import type { JSONContent } from '@tiptap/core';
import { derived, get, writable } from 'svelte/store';
import type { Annotation } from '@prisma/client';
import { updateAnnotationMutation } from '$lib/queries/mutations';
import { mutate } from '$lib/queries/query';
import { toast } from 'svelte-sonner';
import { useQueryClient } from '@tanstack/svelte-query';

// Annotations should look like this:
export type Annotations = Record<string, AnnotationInfo>;

// this is a simple object store with some helper functions

// Partial of our Annotation Schema with Els
type AnnotationInfo = {
	id: string;
	temporary?: boolean;
	target: TargetSchema;
	body?: string | null;
	contentData?: JSONContent | null;
	els: {
		highlightElements: HTMLElement[];
		removeHighlights: () => void;
	}[];
	// TODO: add more info here
};
// & Partial<Annotation>;

export function createAnnotationStore() {
	const queryClient = useQueryClient();

	const store = writable<Annotations>({});

	const showEditAnnotation = writable(false);
	const _activeAnnotationId = writable<string | null>(null);

	const updateMutation = updateAnnotationMutation();

	let lastDeletedAnnotation: AnnotationInfo | null = null;

	function show() {
		showEditAnnotation.set(true);
	}

	function hide() {
		showEditAnnotation.set(false);
	}

	function clear() {
		showEditAnnotation.set(false);
		_activeAnnotationId.set(null);
	}

	const activeAnnotationId = {
		subscribe: _activeAnnotationId.subscribe,
		set: (id: string | null) => {
			_activeAnnotationId.set(id);
		},
		clear,
		show,
		hide
	};

	const _activeAnnotation = derived(
		[store, _activeAnnotationId],
		([$store, $activeAnnotationId]) => {
			if (!$activeAnnotationId) return null;
			return $store[$activeAnnotationId] ?? null;
		}
	);

	const activeAnnotation = {
		..._activeAnnotation,
		show,
		hide,
		clear,
		remove: () => {
			const annotation = get(_activeAnnotation);
			lastDeletedAnnotation = annotation;
			if (!annotation?.id) return;
			remove(annotation.id);
		}
	};

	function remove(id: string) {
		store.update((annotations) => {
			const annotation = annotations[id];
			if (annotation) {
				annotation.els.forEach((el) => el.removeHighlights());
			}
			delete annotations[id];
			return annotations;
		});
	}

	/**
	 * Given a set of annotation IDs, delete all annotations that are not in the set
	 * @param ids Annotaton IDs to sync
	 */
	function sync(ids: string[]) {
		store.update((annotations) => {
			const toRemove = Object.keys(annotations).filter((id) => !ids.includes(id));
			toRemove.forEach((id) => {
				const annotation = annotations[id];
				annotation?.els.forEach((el) => el.removeHighlights());
				delete annotations[id];
			});
			return annotations;
		});
	}

	function reset() {
		store.set({});
	}

	function add(id: string, annotation: AnnotationInfo) {
		store.update((annotations) => {
			annotations[id] = annotation;
			return annotations;
		});
	}

    let tempId: string | null = null;

    /**
     * Adds a temporary annotation to the store, and sets it as the active annotation (unless set otherwise)
     * @param id ID
     * @param annotation Annotation
     * @param setActiveAnnotation Whether to set the temp annotation as the active annotation
     */
	function addTemp(id: string, annotation: AnnotationInfo, setActiveAnnotation = true) {
		store.update((annotations) => {
			annotations[id] = {
				...annotation,
				temporary: true
			};
			return annotations;
		});
        tempId = id;
        if (setActiveAnnotation) {
            activeAnnotationId.set(id);
        }
	}

    /**
     * Removes the temporary flag from the temp annotation
     */
    function saveTemp() {
        store.update((annotations) => {
            if (!tempId) return annotations;
            const annotation = annotations[tempId];
            if (!annotation) return annotations;
            annotation.temporary = false;
            return annotations;
        });
        tempId = null;
    }

    function removeTemp() {
        if (tempId) {
            remove(tempId);
        }
        tempId = null;
    }

	return {
		activeAnnotationId,
		activeAnnotation,
		showEditAnnotation,
		annotations: {
			...store,
			remove,
			sync,
			reset,
			add,
            addTemp,
            saveTemp,
            removeTemp,
            hasTemp: () => !!tempId,
			restore: () => {
				if (lastDeletedAnnotation) {
					console.log({ lastDeletedAnnotation });
					add(lastDeletedAnnotation.id, lastDeletedAnnotation);
					toast.promise(
						mutate('save_note', {
							id: lastDeletedAnnotation.id,
							deleted: null
						}),
						{
							success: () => {
								queryClient.invalidateQueries({
									queryKey: ['notes', 'detail']
								});
								lastDeletedAnnotation = null;
								return 'Note restored';
							},
							error: () => 'Error restoring note',
							loading: 'Restoring note...'
						}
					);
				}
			}
		},
		updateMutation
	};
}
