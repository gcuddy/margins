import type { Entry, Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { derived, Writable, writable } from "svelte/store";
import { match, P } from "ts-pattern";
import type { ConditionalPick, Entries, RequireExactlyOne } from "type-fest";
import { z } from "zod";

import { page } from "$app/stores";
import type { EntryWithBookmark } from "$lib/entry.server";
import type { IconName } from "$lib/icons";


export const filterTerm = writable("");

export const filterInputActive = writable(false);

interface CurrentItemStore<T> {
	items: T[];
	keys: string[];
}

export interface SearchStoreModel<T extends Record<PropertyKey, any>> {
	data: T[];
	filtered: T[];
	search: string;
}

export function createItemStores<T>(startingItems: T[], ...keys: string[]) {
	// todo: ideally i want this to be able to be set the type later. how is that possible?
	let lastPath: string | undefined;
	const items = writable<CurrentItemStore<T>>({
		items: startingItems,
		keys,
	});
	const { subscribe, set: _set, update } = items;
	const filterTerm = writable("");
	const set = (items: T[], ...keys: string[]) => {
		_set({
			items,
			keys,
		});
	};
	const filteredItems = derived([filterTerm, items, page], ([$term, $currentItems, $page]) => {
		if (!lastPath) {
			lastPath = $page.url.pathname;
		} else if (lastPath !== $page.url.pathname) {
			lastPath = $page.url.pathname;
			filterTerm.set("");
		}
		if (!$currentItems) {
			return [];
		}
		if ($term === "") {
			return $currentItems.items;
		}
		const { items, keys } = $currentItems;
		const filtered = items.filter((item) => searchObjectKeys(item, $term, ...keys));
		return filtered;
	});
	return {
		items: {
			set,
			subscribe,
			update,
		},
		filteredItems,
		filterTerm,
	};
}

export type StringKeys<TObj extends {}> = keyof ConditionalPick<TObj, string | null>;

// TODO: Additional types so that Keys must be type string
export function searchObjectKeys<TObj extends Record<string, any>>(
	object: TObj,
	term: string,
	...keys: StringKeys<TObj>[]
) {
	if (keys.length === 0) {
		return false;
	}
	for (const key of keys) {
		if (object[key] && object[key].toString()?.toLowerCase().includes(term.toLowerCase())) {
			return true;
		}
	}
	return false;
}

type AndSerializableFilter<T extends Record<PropertyKey, any>> = {
	AND: SerializableFilter<T>[];
};
type OrSerializableFilter<T extends Record<PropertyKey, any>> = {
	OR: SerializableFilter<T>[];
};
type NoneSerializableFilter<T extends Record<PropertyKey, any>> = {
	NONE: SerializableFilter<T>[];
};

// REVIEW

type Enumerable<T> = T | Array<T>;

type Selector<T> = {
	null?: boolean;
	in: T[];
};

type DateTime = string | Date;

type StringSelector = {
	equals?: string;
	contains?: string;
	search?: string;
	in?: Enumerable<string>;
};

type DateTimeSelector = {
	equals?: Nullable<DateTime>;
	in?: Nullable<Enumerable<DateTime>>;
	notIn?: Nullable<Enumerable<DateTime>>;
	lt?: DateTime;
	lte?: DateTime;
	gt?: DateTime;
	gte?: DateTime;
	not?: Nullable<DateTime>;
};

type IntSelector = {
	equals?: number;
	lt?: number;
	gt?: number;
};

type Nullable<T> = T | null;

type SerializableFilter<Obj extends Record<PropertyKey, any>> = {
	[Key in keyof Obj]?: Obj[Key] extends boolean
		? boolean
		: Obj[Key] extends Nullable<string>
		? StringSelector
		: Obj[Key] extends Nullable<DateTime>
		? DateTimeSelector
		: SerializableFilter<Obj[Key]>;
};

// {
// 	key: string;
// 	value?: string;
// 	comparisonType?: "=" | "lt" | "gt";
// 	type?: "date" | "string" | "number" | "boolean";
// 	filters?: SerializableFilters<T>;
// }
// interface SerializableFilter<T> {
// 	key: string;
// 	value?: string;
// 	comparisonType?: "=" | "lt" | "gt";
// 	type?: "date" | "string" | "number" | "boolean";
// 	filters?: SerializableFilters<T>;
// }

const filterTest: SerializableFilters<EntryWithBookmark> = {
	NONE: [
		{
			createdAt: {
				lt: new Date(),
			},
		},
		{
			title: {
				contains: "Test",
			},
		},
	],
};

type SerializableFilters<T extends Record<string, any>> = RequireExactlyOne<
	{
		AND: SerializableFilter<T>[];
		NONE: SerializableFilter<T>[];
		OR: SerializableFilter<T>[];
	},
	"AND" | "OR" | "NONE"
>;

const none = <T>(arr: T[], callback: (item: T) => boolean) => !arr.some(callback);

// const none = (arr: any[], fn: Predicate<any> = Boolean) => !arr.some(fn);

function serializedFilterToJavascriptFilter<T extends Record<PropertyKey, any>>(
	filter: SerializableFilters<T>,
	items: T[]
) {
	let conditions: SerializableFilter<T>[] | undefined = undefined;
	// let fn = (cb: (item: T) => boolean) => items.every(item => true)
	// fn()
	if ("AND" in filter && filter.AND) {
		conditions = filter.AND;
	}
	if ("OR" in filter && filter.OR) {
		conditions = filter.OR;
		// fn = () => items.some()
	}
	// if ("NONE" in filter && filter.NONE) {
	// 	conditions = filter.NONE
	// 	fn = none
	// }
	if (!conditions) {
		throw new Error("Conditions not found");
	}
	// todo: every and none etc
	items.filter((item) => {
		conditions?.every((condition) => {
			const entries = Object.entries(condition) as Entries<typeof condition>;
			entries.forEach(([k, v]) => {
				item[k];
			});
		});
	});

	return items.filter((item) => {
		let k: keyof typeof item;
		const a = Object.keys(filter);
	});
	Object.entries(filter).forEach((entry) => {
		const a = entry[1];
	});
}

const arr = [
	{
		unread: true,
		id: 0,
	},
	{
		unread: false,
		id: 1,
	},
	{
		unread: true,
		id: 2,
	},
];

arr.filter((a) => a.unread);
// id: 0, id 2

const filterForArr: SerializableFilters<(typeof arr)[number]> = {
	AND: [
		{
			unread: true,
			// id:
		},
	],
};

const convertStoF = (f: typeof filterForArr) => {
	const conditions = f.AND;
	const fn = conditions.every;
	conditions.forEach((condition) => {
		const entries = Object.entries(condition) as Entries<typeof condition>;
		entries.forEach(([k, v]) => {
			arr.filter((a) => {
				a[k] === v;
			});
		});
	});
	arr.filter((a) => {});
};

export interface FilterModel<T> {
	filter: (item: T) => boolean;
	negated?: (item: T) => boolean;
	id: string;
	is?: boolean;
	name: string;
	icon?: IconName;
	parent?: string;
	boolean?: boolean;
	display?: {
		name?: string;
		choices?: FilterModel<T>[];
	};
}

type DayjsDuration = [number, dayjs.ManipulateType];

type DateManipulation = {
	subtract?: DayjsDuration;
	add?: DayjsDuration;
};

interface IDateFilter {
	lt?: string | DateManipulation;
	lte?: string | DateManipulation;
	gt?: string | DateManipulation;
	gte?: string | DateManipulation;
	equals?: string | DateManipulation;
}

const d: DateFilter = {
	lt: {
		subtract: [2, "weeks"],
	},
};

const a: SFilter<Entry> = {
	published: {
		gt: {
			subtract: [2, "w"],
		},
	},
};
const StringFilterSchema = z
	.object({
		contains: z.string(),
		equals: z.string(),
	})
	.partial();

type StringFilter = z.infer<typeof StringFilterSchema>;

const DateSchema = z.date().or(z.string().datetime());
const units = ["h", "d", "w", "M", "y"] as const;
type Unit = (typeof units)[number];
const UnitSchema = z.enum(units);

const DateManipulationSchema = z
	.object({
		subtract: z.tuple([z.number(), UnitSchema]),
		add: z.tuple([z.number(), UnitSchema]),
	})
	.partial();
const DateFilterSchema = z
	.object({
		lt: DateSchema.or(DateManipulationSchema),
		gt: DateSchema.or(DateManipulationSchema),
		gte: DateSchema.or(DateManipulationSchema),
		lte: DateSchema.or(DateManipulationSchema),
		equals: DateSchema.or(DateManipulationSchema),
	})
	.partial();

type DateFilter = z.infer<typeof DateFilterSchema>;

const schema = <S extends z.Schema<any, any>>(schema: S) =>
	P.when((obj: unknown): obj is z.infer<S> => schema.safeParse(obj).success);

type SFilter<Obj extends Record<PropertyKey, any>> = {
	[Key in keyof Obj]?: Obj[Key] extends Nullable<string>
		? StringFilter
		: Obj[Key] extends Nullable<DateTime>
		? DateFilter
		: never;
};

const testingtesting = <T extends {}>(filter: SFilter<T>) => {
	let key: keyof SFilter<T>;
	for (key in filter) {
		const val = filter[key];
		if (!val) continue;
		// match<DateFilter | StringFilter, boolean>(val)
		// 	.with(schema(DateFilterSchema), (data) =>{

		// 	})
		// .with({
		// 	equals: P.when(s => )
		// }, () => )
	}
};

const testFilter = (f: DateFilter | StringFilter, value: string) => {
	return match<DateFilter | StringFilter, boolean>(f)
		.with(
			{
				equals: P.select(P.string),
			},
			(str) => value === str
		)
		.with(
			{
				contains: P.select(P.string),
			},
			(s) => value.includes(s)
		)
		.with(
			{
				gt: P.select(schema(DateManipulationSchema)),
			},
			({ subtract, add }) => {
				if (subtract) {
					return dayjs(value).isAfter(dayjs().subtract(subtract[0], subtract[1]));
				} else if (add) {
					return dayjs(value).isAfter(dayjs().add(add[0], add[1]));
				} else {
					return false;
				}
			}
		)
		.with(
			{
				gt: P.select(),
			},
			(gt) => {
				if (typeof gt === "object") {
					gt;
				} else {
					dayjs(gt);
				}
			}
		)
		.exhaustive();
};

const f: SFilter<Entry> = {
	createdAt: {
		gt: {
			subtract: [2, "w"],
		},
	},
};

const dtodayjs = (d: DateFilter) => {
	let key: keyof DateFilter;
	for (key in d) {
		const a = d[key];
		if (!a) continue;
		return match(a)
			.with(P.string, (date) => dayjs(date).toDate())
			.with(
				{
					subtract: [P.number, P.string],
				},
				({ subtract: [n, unit] }) => dayjs().subtract(n, unit).toDate()
			)
			.with(
				{
					add: [P.number, P.string],
				},
				({ add: [n, unit] }) => dayjs().add(n, unit).toDate()
			)
			.otherwise(() => undefined);
	}
};

// REVIEW: lol at this name
const filterFilterModel = <T>(f: FilterModel<T>, item: Record<PropertyKey, any>) => {
	// gross double nesting, sorry everyone
	if (f.is === false) {
		if (!f.negated) {
			console.warn("[filter] No negated option present");
			return f.filter(item);
		}
		return f.negated(item);
	}
	return f.filter(item);
};

// route, filterStore
// TODO: sync this store with local state ala Linear
export type FilterMap = Map<string, FilterModel<any>[]>;
export type FilterMapStore = Writable<FilterMap>;

export type FilterQueryStore<T> = Writable<{
	filters: FilterMapStore;
	fetcher: () => T[];
}>;

// export const createFilterMapStore = () => {
// 	return writable
// }

/**
 *
 * @param data An array of objects to set up filters for.
 * @param keys Keys in the object to search through when using search.
 * @returns an object containing helper stores
 */
export const createFilterStores = <T extends Record<PropertyKey, any>>(
	{ data, filters: _filters }: { data: T[]; filters?: FilterModel<T>[] },
	...keys: StringKeys<T>[]
) => {
	const items = writable(data);
	const searchTerm = writable("");
	console.log({ _filters });
	const _filterStore = writable<FilterModel<T>[]>(_filters || []);
	const filters = {
		..._filterStore,
		remove: (id: string) => {
			_filterStore.update((filters) => {
				return filters.filter((f) => f.id !== id);
			});
		},
		reset: () => _filterStore.set([]),
	};
	const any = writable<"any" | "none" | "all">("all");

	const filteredItems = derived(
		[items, searchTerm, filters, any],
		([$items, $searchTerm, $filters, $any]) => {
			let filtered = $items;
			filtered = $items.filter((item) =>
				match($any)
					.with("any", () => $filters.some((f) => filterFilterModel(f, item)))
					.with("all", () => $filters.every((f) => filterFilterModel(f, item)))
					.with("none", () => !$filters.every((f) => filterFilterModel(f, item)))
					.exhaustive()
			);
			// Now filter additionally by search term
			if (!$searchTerm.trim() || !keys.length) return filtered;
			return filtered.filter((f) => searchObjectKeys(f, $searchTerm, ...keys));
		}
	);

	return {
		items,
		filteredItems,
		searchTerm,
		filters,
		any,
	};
};

/**
 *
 * @param data An array of objects to set up filters for.
 * @param keys Keys in the object to search through when using search.
 * @returns an object containing helper stores
 */
export const createQueryFilterStore = <T extends Record<PropertyKey, any>>(
	{ data, filters: _filters }: { data: T[]; filters?: FilterModel<T>[] },
	...keys: StringKeys<T>[]
) => {

// Take in

	const items = writable(data);
	const searchTerm = writable("");
	console.log({ _filters });
	const _filterStore = writable<FilterModel<T>[]>(_filters || []);
	const filters = {
		..._filterStore,
		remove: (id: string) => {
			_filterStore.update((filters) => {
				return filters.filter((f) => f.id !== id);
			});
		},
		reset: () => _filterStore.set([]),
	};
	const any = writable<"any" | "none" | "all">("all");

	const filteredItems = derived(
		[items, searchTerm, filters, any],
		([$items, $searchTerm, $filters, $any]) => {
			let filtered = $items;
			filtered = $items.filter((item) =>
				match($any)
					.with("any", () => $filters.some((f) => filterFilterModel(f, item)))
					.with("all", () => $filters.every((f) => filterFilterModel(f, item)))
					.with("none", () => !$filters.every((f) => filterFilterModel(f, item)))
					.exhaustive()
			);
			// Now filter additionally by search term
			if (!$searchTerm.trim() || !keys.length) return filtered;
			return filtered.filter((f) => searchObjectKeys(f, $searchTerm, ...keys));
		}
	);

	return {
		items,
		filteredItems,
		searchTerm,
		filters,
		any,
	};
};

export type FilterStores<T extends {}> = ReturnType<typeof createFilterStores<T>>;

// for entries
const createFilterStore = () => {
	const { subscribe, set, update } = writable<{
		filters: Prisma.EntryWhereInput[];
		and: "AND" | "OR" | "NOT";
	}>({
		filters: [],
		and: "AND",
	});
	return {
		subscribe,
		set,
		update,
		actions: {
			add: (filter: Prisma.EntryWhereInput) => update((s) => ({ ...s, filters: [...s.filters, filter] })),
		},
	};
};

const filterStore = createFilterStore();

export const filterStoreActions = filterStore.actions;

export const filteredEntriesQuery = derived(filterStore, ($filters) => {
	return {
		queryKey: ["entries", $filters],
		queryFn: async () =>
			trpc().entries.filter.query({
				where: {
					AND: $filters,
				},
			}),
	};
});
