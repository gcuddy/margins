import type {
	Expression,
	ExpressionBuilder,
	ExpressionWrapper,
	ReferenceExpression,
	SqlBool,
} from 'kysely';

import type { Comparator } from '$lib/schemas/inputs/comparators';
import { ObjectEntry, objectEntries, objectKeys } from '$lib/helpers';

export type BaseInputFilter<T> = {
	[K in keyof T]: Comparator; // T[K] extends StringComparator ? T[K] : InputFilter<T[K]>
};

type InputFilter<T> = Partial<BaseInputFilter<T>> & {
	and?: Array<InputFilter<T>>;
	or?: Array<InputFilter<T>>;
};

type BaseCustomFilter<T extends {}> = {
	[K in keyof T]: T[K];
};

type CustomFilter<T extends {}> = Partial<T> & {
	and?: Array<CustomFilter<T>>;
	or?: Array<CustomFilter<T>>;
};



// gotta do something to generate and/or, something
export function applyFilter<DB, TB extends keyof DB, TModel = DB[TB]>(
	eb: ExpressionBuilder<DB, TB>,
	filter: InputFilter<DB[TB]>,
	// andor: 'and' | 'or' = 'and'
) {
	console.log(`applying filter`, { filter });
	const expressions = Object.entries(filter)
		.map(([field, comparator]) => {
			// console.log({ comparator, field });
			// If comparator is undefined, we don't want to apply a filter
			if (!comparator) {
				return;
			}
			console.log({ field, comparator });
			if (field === 'and' || field === 'or') {
				const subFilters = filter[field] ?? [];
				// TODO: map over and add and/or eb clauses
				const exprs: Array<Expression<SqlBool>> = [];
				for (const subFilter of subFilters) {
					exprs.push(applyFilter(eb, subFilter));
				}
				if (field === 'and') {
					return eb.and(exprs);
				}
				return eb.or(exprs);
			} else if (field) {
				// TODO: avoid this cast - the object.entries gives me an array, tho?
				const comparator = filter[field as keyof DB[TB]];
				console.log({ comparator });
				if (comparator) {
					objectKeys(comparator).forEach((key) => {
						const x = { [key]: comparator[key as any] };
					});
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					return generateComparatorClause(eb, field as any, comparator);
				}
			}
		})
		.filter(Boolean);
	return eb.and(expressions);
	// return eb.or(expressions);
}
export function applyFilterWith<DB, TB extends keyof DB, TFilterObj extends {}>(
	eb: ExpressionBuilder<DB, TB>,
	filter: CustomFilter<TFilterObj>,
	cb: <TKey extends keyof TFilterObj>(
		eb: ExpressionBuilder<DB, TB>,
		// filter: {
		// 	[K in Exclude<keyof TObj, undefined>]: TObj[K];
		// },
		// value: BaseCustomFilter<TObj>[keyof BaseCustomFilter<TObj>],
		...args: ObjectEntry<TFilterObj>
		// key: TKey,
		// value: TFilterObj[TKey],
	) => Expression<SqlBool>,
) {
	console.log(`applying filter`, { filter });

	const nonUndefinedKeys = objectKeys(filter).filter(
		(key) => filter[key] !== undefined,
	);
	const exprs = nonUndefinedKeys.map((key) => {
		const value = filter[key];
		if (value) {
			return cb(eb, key, value);
		}
	});
	const expressions = objectEntries(filter)
		.map(([field, comparator]) => {
			// console.log({ comparator, field });
			// If comparator is undefined, we don't want to apply a filter
			if (!comparator) {
				return;
			}
			console.log({ field, comparator });
			if (field === 'and' || field === 'or') {
				const subFilters = filter[field === 'and' ? 'and' : 'or'];
				// TODO: map over and add and/or eb clauses
				const exprs: Array<Expression<SqlBool>> = [];
				if (subFilters) {
					for (const subFilter of subFilters) {
						exprs.push(applyFilterWith(eb, subFilter, cb));
					}
				}
				if (field === 'and') {
					return eb.and(exprs);
				}
				return eb.or(exprs);
			} else if (field) {
				if (field === 'and' || field === 'or') {
					return;
				}
				if (comparator) {
					const value = filter[field];
					if (value) {
						return cb(eb, field, comparator);
					}
				}
			}
		})
		.filter(Boolean);
	return eb.and(expressions);
	// return eb.or(expressions);
}

export function generateComparatorClause<DB, TB extends keyof DB>(
	eb: ExpressionBuilder<DB, TB>,
	field: ReferenceExpression<DB, TB>,
	comparator: Comparator, // TODO: this could be any comparator, not just string
) {
	if (typeof comparator === 'string') {
		return eb(field, '=', comparator);
	}

	console.log(`Generating comparator clause`, { comparator });

	const {
		eq,
		in: _in,
		neq,
		nin,
		// contains,
		// ncontains,
		// startsWith,
		// nstartsWith,
		...rest
	} = comparator;
	const _exhaustiveCheck: Required<typeof rest> = {}; // If this line errors, you need to add a case for the missing comparator, and make sure case is handled

	// TODO: instead of these being exclusive, should they be additive?
	// TODO: is there a better way to handle this, like going through Object.keys and typing that?
	// something like:
	// for (const key in comparator) {
	//     if (key === 'eq') {
	//         let wrapper = eb(field, '=', comparator[key])
	//     } else if... (should be exhaustive)
	// }

	const exprs: Array<ExpressionWrapper<DB, TB, SqlBool>> = [];

	if (eq) {
		exprs.push(eb(field, '=', eq));
	}

	if (neq) {
		exprs.push(eb(field, '!=', neq));
	}

	if (_in) {
		exprs.push(eb(field, 'in', _in));
	}

	if (nin) {
		exprs.push(eb(field, 'not in', nin));
	}

	if (
		'contains' in rest ||
		'ncontains' in rest ||
		'startsWith' in rest ||
		'nstartsWith' in rest
	) {
		// Then we have a string comparator
		const { contains, ncontains, nstartsWith, startsWith } = rest;

		if (contains) {
			exprs.push(eb(field, 'like', `%${contains}%`));
		}

		if (ncontains) {
			exprs.push(eb(field, 'not like', `%${ncontains}%`));
		}

		if (startsWith) {
			exprs.push(eb(field, 'like', `${startsWith}%`));
		}

		if (nstartsWith) {
			exprs.push(eb(field, 'not like', `${nstartsWith}%`));
		}
	}

	if ('gte' in rest || 'gt' in rest || 'lte' in rest || 'lt' in rest) {
		const { gt, gte, lt, lte } = rest;

		if (gte) {
			exprs.push(eb(field, '>=', gte));
		}

		if (gt) {
			exprs.push(eb(field, '>', gt));
		}

		if (lte) {
			exprs.push(eb(field, '<=', lte));
		}

		if (lt) {
			exprs.push(eb(field, '<', lt));
		}
	}

	return eb.and(exprs);

	console.log({ rest });
	throw new Error('Unreachable');
}
