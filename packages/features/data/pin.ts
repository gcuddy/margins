import type { Entry, Favorite } from '@margins/db/kysely/types';
import type { Selectable } from 'kysely';
import { Store } from '../replicache/svelte-store.js';

export type PinType = 'Entry' | 'Annotation';

export type Pin = Selectable<Favorite> & {
	entry?: Selectable<Entry>;
};

export const PinStore = new Store()
	.$type<Pin>()
	.scan('list', () => ['Pin'])
	.get((type: PinType, id: string) => ['Pin', type, id])
	.build();
