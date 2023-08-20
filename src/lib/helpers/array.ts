import { dev } from '$app/environment';
import type { Entry } from '@prisma/client';

export function groupBy<T, K>(array: T[], keySelector: (item: T) => K): Map<K, T[]> {
	if (dev) console.time('groupBy');
	const groups = new Map<K, T[]>();

	for (const item of array) {
		const key = keySelector(item);
		const group = groups.get(key);

		if (group) {
			group.push(item);
		} else {
			groups.set(key, [item]);
		}
	}
	if (dev) console.timeEnd('groupBy');

	return groups;
}

export type GroupedArrayWithHeadings<T, HObj extends {}> = (
	| ({ isHeading: true } & HObj)
	| /*{ isHeading: false } &*/ T
)[];

export function convertToGroupedArrayWithHeadings<T, H, HObj extends {}>(
	dataMap: Map<H, T[]>,
	headingFactory: (heading: H) => HObj
): GroupedArrayWithHeadings<T, HObj> {
	const groupedArrayWithHeadings: GroupedArrayWithHeadings<T, HObj> = [];

	for (const [groupKey, groupItems] of dataMap.entries()) {
		const heading = headingFactory(groupKey);
		groupedArrayWithHeadings.push({
			isHeading: true,
			...heading
		});

		for (const item of groupItems) {
			groupedArrayWithHeadings.push(item);
		}
	}

	return groupedArrayWithHeadings;
}
