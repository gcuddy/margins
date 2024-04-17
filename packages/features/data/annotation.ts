import type { Annotation as TAnnotation } from '@margins/db/kysely/types';
import type { Selectable } from 'kysely';
import { Store } from '../replicache/svelte-store.js';

export type Annotation = Selectable<TAnnotation>;

export const AnnotationStore = new Store()
	.$type<Annotation>()
	.scan('list', () => ['Annotation'])
	.get((id: string) => ['Annotation', id])
	.build();
