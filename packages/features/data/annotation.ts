import type { Annotation } from '@margins/db/kysely/types';
import type { Selectable } from 'kysely';
import { Store } from '../replicache/svelte-store.js';

export const AnnotationStore = new Store()
	.$type<Selectable<Annotation>>()
	.scan('list', () => ['Annotation'])
	.get((id: string) => ['Annotation', id])
	.build();
