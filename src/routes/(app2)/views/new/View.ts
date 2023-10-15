import { fail } from '@sveltejs/kit';
import { sql } from 'kysely';
import { nanoid } from 'nanoid';
import { z } from 'zod';

import { db } from '$lib/db';
import { entrySelect } from '$lib/db/selects';
import {
	number_operands,
	status as statuses,
	types as entryTypes,
} from '$lib/types';

const baseView = z.object({
	id: z.string(),
});

const typeView = baseView.extend({
	filter: z.enum(entryTypes),
	type: z.literal('Type'),
});

const statusView = baseView.extend({
	filter: z.enum(statuses),
	type: z.literal('Status'),
});

const tagView = baseView.extend({
	/** refers to id of tag */
	filter: z.number().int().positive(),

	type: z.literal('Tag'),
});

const contentView = baseView.extend({
	filter: z.string(),
	type: z.literal('Content'),
});

const publisherView = baseView.extend({
	filter: z.string(),
	type: z.literal('Publisher'),
});

const hasNotesView = baseView.extend({
	filter: z.boolean(),
	type: z.literal('Notes'),
});

const progressView = baseView.extend({
	filter: z.number().int().min(0).max(100),
	operand: z.enum(number_operands),
	type: z.literal('Progress'),
});

const wordCountView = baseView.extend({
	filter: z.number().int().min(0),
	operand: z.enum(number_operands),
	type: z.literal('Word Count'),
});

const createdAtView = baseView.extend({
	filter: z.enum(['DAY', 'MONTH', 'WEEK', 'YEAR']),
	type: z.literal('Added'),
});

// type Input = "Select" | "Input";

const VIEWS = [
	typeView,
	statusView,
	tagView,
	contentView,
	hasNotesView,
	publisherView,
	progressView,
	wordCountView,
	createdAtView,
] as const;

export const viewSchema = z.union(VIEWS);

export type Condition = z.infer<typeof viewSchema>;

export const types = VIEWS.map((view) => view.shape.type.value);

// const typeToInputLookup: Record<Condition["type"], Input> = {
//     Type: ""
//  }

export const typeLookup = {
	// Type:
	// Contains Type, and then lookupf or page.svelte to determine input, operand etc
};

export type IView = {
	conditions: Array<Condition>;
	name: string;
};

export class View {
	conditions: Array<Condition> = [];
	name = '';

	/**
	 * Create a view object from the user's cookie, or initialise a new view
	 * @param {string | undefined} serialized
	 */
	constructor(serialized: string | IView | undefined = undefined) {
		if (serialized) {
			if (typeof serialized === 'object') {
				this.conditions = serialized.conditions;
				this.name = serialized.name;
			} else {
				const { conditions, name } = JSON.parse(serialized) as {
					conditions: Array<Condition>;
					name: string;
				};
				this.conditions = conditions;
				this.name = name;
			}
		}
	}

	add(type: Condition['type']) {
		switch (type) {
			case 'Status':
				this.conditions.push({
					filter: 'Now',
					id: nanoid(),
					type,
				});
				break;
			case 'Type':
				this.conditions.push({
					filter: 'book',
					id: nanoid(),
					type,
				});
				break;
			case 'Tag':
				this.conditions.push({
					filter: 0,
					id: nanoid(),
					type,
				});
				break;
			case 'Content':
				this.conditions.push({
					filter: '',
					id: nanoid(),
					type,
				});
				break;
			case 'Notes':
				this.conditions.push({
					filter: false,
					id: nanoid(),
					type,
				});
				break;
			case 'Publisher':
				this.conditions.push({
					filter: '',
					id: nanoid(),
					type,
				});
				break;
			case 'Progress':
				this.conditions.push({
					filter: 0,
					id: nanoid(),
					operand: '=',
					type,
				});
				break;
			case 'Word Count': {
				this.conditions.push({
					filter: 0,
					id: nanoid(),
					operand: '=',
					type,
				});
				break;
			}
			case 'Added': {
				this.conditions.push({
					filter: 'WEEK',
					id: nanoid(),
					type,
				});
				break;
			}
		}
	}

	delete(id: Condition['id']) {
		this.conditions = this.conditions.filter(
			(condition) => condition.id !== id,
		);
	}

	set({ conditions, name }: IView) {
		this.conditions = conditions;
		this.name = name;
	}

	rename(name: string) {
		this.name = name;
	}

	update(data: FormData) {
		const name = data.get('name') as string;
		const types = data.getAll('type');
		const filters = data.getAll('filter');
		const operands = data.getAll('operand');
		const ids = data.getAll('id');

		if (types.length !== filters.length || types.length !== ids.length) {
			// console.log({ filters, ids, types });
			return fail(400);
		}
		const conditions = types.map((type, i) => {
			return {
				filter: type !== 'Tag' ? filters[i] : Number(filters[i]),
				id: ids[i],
				operand: operands[i] !== 'false' ? operands[i] : undefined,
				type,
			};
		}) as Array<Condition>;
		// console.log({ conditions });

		this.set({ conditions, name });
	}

	static async preview(
		conditions: Array<Condition>,
		userId: string,
		cursor?: Date | null,
	) {
		let query = db
			.selectFrom('Entry as e')
			.innerJoin('Bookmark as b', (join) =>
				join.onRef('e.id', '=', 'b.entryId').on('b.userId', '=', userId),
			)
			.leftJoin('EntryInteraction as ei', (join) =>
				join.onRef('e.id', '=', 'ei.entryId').on('ei.userId', '=', userId),
			);
		// .leftJoin("Annotation as an", "an.entryId", "e.id")
		conditions.forEach((condition) => {
			switch (condition.type) {
				case 'Type': {
					query = query.where('e.type', '=', condition.filter);
					break;
				}
				case 'Status': {
					query = query.where('b.status', '=', condition.filter);
					break;
				}
				case 'Tag': {
					query = query
						.innerJoin('TagOnEntry as et', (join) =>
							join
								.onRef('e.id', '=', 'et.entryId')
								.on('et.userId', '=', userId),
						)
						.where('et.tagId', '=', Number(condition.filter));
					break;
				}
				case 'Content': {
					query = query.where(
						sql`MATCH(e.title,e.author,e.text) AGAINST (${condition.filter})`,
					);
					break;
				}
				case 'Notes': {
					break;
				}
				case 'Publisher': {
					query = query.where('e.publisher', '=', condition.filter);
					break;
				}
				case 'Progress': {
					query = query.where(
						'ei.progress',
						condition.operand,
						condition.filter,
					);
					break;
				}
				case 'Word Count': {
					query = query.where(
						'e.wordCount',
						condition.operand,
						condition.filter,
					);
					break;
				}
				case 'Added': {
					// console.log({ condition });
					query = query.where(
						sql`b.createdAt between date_sub(now(), INTERVAL 1 ${sql.raw(
							condition.filter,
						)}) and now()`,
					);
				}
			}
		});
		if (cursor) {
			query = query.where('b.createdAt', '<', cursor);
		}
		const entries = await query
			.select([
				...entrySelect,
				'b.status',
				// "b.sort_order",
				'ei.progress',
				'b.createdAt',
			])
			.orderBy('b.createdAt', 'desc')
			.limit(26)
			.execute();
		let nextCursor: typeof cursor | undefined = undefined;
		if (entries.length > 25) {
			const nextItem = entries.pop();
			if (nextItem) {
				nextCursor = nextItem.createdAt;
			}
		}
		return {
			entries,
			nextCursor,
		};
	}

	toString() {
		return JSON.stringify({ conditions: this.conditions, name: this.name });
	}
}
