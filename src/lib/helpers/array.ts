import type { Entry } from '@prisma/client';
import type { ConditionalPick } from 'type-fest';

import { dev } from '$app/environment';
import type { TypeKeys } from '$lib/utils/type-utils';

export function groupBy<T, K>(
	array: Array<T>,
	keySelector: (item: T) => K,
): Map<K, Array<T>> {
	if (dev) {
		console.time('groupBy');
	}
	const groups = new Map<K, Array<T>>();

	for (const item of array) {
		const key = keySelector(item);
		const group = groups.get(key);

		if (group) {
			group.push(item);
		} else {
			groups.set(key, [item]);
		}
	}
	if (dev) {
		console.timeEnd('groupBy');
	}

	return groups;
}

export type GroupedArrayWithHeadings<T, HObj extends {}> = Array<
	({ isHeading: true } & HObj) | /*{ isHeading: false } &*/ T
>;

export function convertToGroupedArrayWithHeadings<T, H, HObj extends {}>(
	dataMap: Map<H, Array<T>>,
	headingFactory: (heading: H) => HObj,
): GroupedArrayWithHeadings<T, HObj> {
	const groupedArrayWithHeadings: GroupedArrayWithHeadings<T, HObj> = [];

	for (const [groupKey, groupItems] of dataMap.entries()) {
		const heading = headingFactory(groupKey);
		groupedArrayWithHeadings.push({
			isHeading: true,
			...heading,
		});

		for (const item of groupItems) {
			groupedArrayWithHeadings.push(item);
		}
	}

	return groupedArrayWithHeadings;
}

export function chunk<T>(array: Array<T>, size: number): Array<Array<T>> {
	const chunked_arr = [];
	let index = 0;
	while (index < array.length) {
		chunked_arr.push(array.slice(index, size + index));
		index += size;
	}
	return chunked_arr;
}

export function getNewPositions<
	TId extends string | number,
	TObject extends { id: TId },
	TKey extends TypeKeys<TObject, number>,
>(
	array: Array<TObject>,
	key: TKey,
	id: TId,
): {
	data: Array<{
		id: TId;
		position: number;
	}>;
	newPosition: number;
} {
	const idx = array.findIndex((item) => item.id === id);
	const moved = array[idx];
	if (!moved) {
		throw new Error('Item not found');
	}

	const before = array.slice(0, idx);
	const after = array.slice(idx + 1);

	let newPosition = 0;

	if (idx === 0) {
		// we're at the top
		const next = after[0];
		if (next) {
			const nextPosition = (next[key] as number) ?? 0;
			newPosition = nextPosition - 100;
		}
		return {
			data: [
				{
					id: moved.id,
					position: newPosition,
				},
			],
			newPosition,
		};
	} else if (idx === array.length - 1) {
		// we're at the bottom
		const prev = before.at(-1);

		if (prev) {
			const prevPosition = (prev[key] as number) ?? 0;
			newPosition = prevPosition + 100;
		}

		return {
			data: [
				{
					id: moved.id,
					position: newPosition,
				},
			],
			newPosition,
		};
	} else {
		// we're in the middle - this is a more complex calculation
		// let's first check the previous item and next item. if they have a gap of more than 10, we can just put it in the middle

		const prev = before.at(-1);
		const next = after[0];

		if (!prev || !next) {
			throw new Error('Unexpected error');
		}

		const prevPosition = (prev[key] as number) ?? 0;
		const nextPosition = (next[key] as number) ?? 0;

		if (nextPosition - prevPosition > 10) {
			newPosition = Math.round(
				prevPosition + (nextPosition - prevPosition) / 2,
			);
			return {
				data: [
					{
						id: moved.id,
						position: newPosition,
					},
				],
				newPosition,
			};
		} else {
			// we're going to have to change all the positions on *one* side of the moved item
			// let's find out which side has less items, so that we can make the least amount of changes

			const beforeLength = before.length;
			const afterLength = after.length;

			const itemsToChange = beforeLength < afterLength ? before : after;

			for (const item of itemsToChange) {
				const position = (item[key] as number) ?? 0;
				newPosition = position + 100;
			}
		}
	}
	return [];
}
