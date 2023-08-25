import { db } from '$lib/db';
import type { Comparator, StringComparator } from '$lib/schemas/inputs/comparators';
import type { Expression, ExpressionBuilder, ReferenceExpression, SqlBool } from 'kysely';

type BaseInputFilter<T> = {
	[K in keyof T]?: Comparator; // T[K] extends StringComparator ? T[K] : InputFilter<T[K]>
};

type InputFilter<T> = BaseInputFilter<T> & {
	and?: InputFilter<T>[];
	or?: InputFilter<T>[];
};

// gotta do something to generate and/or, something
export function applyFilter<DB, TB extends keyof DB, TModel = DB[TB]>(
	eb: ExpressionBuilder<DB, TB>,
	filter: InputFilter<DB[TB]>,
	// andor: 'and' | 'or' = 'and'
) {
    console.log(`applying filter`, {filter})
	const expressions = Object.entries(filter)
		.map(([field, comparator]) => {
			if (field === 'and' || field === 'or') {
				const subFilters = filter[field] ?? [];
				// TODO: map over and add and/or eb clauses
				const exprs: Expression<SqlBool>[] = [];
				for (const subFilter of subFilters) {
					exprs.push(applyFilter(eb, subFilter));
				}
                console.log({exprs})
				if (field === 'and') {
					return eb.and(exprs);
				}
				return eb.or(exprs);
			} else if (field) {
				// TODO: avoid this cast - the object.entries gives me an array, tho?
				const comparator = filter[field as keyof DB[TB]];
				if (comparator) {
					return generateComparatorClause(eb, field as any, comparator);
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
	comparator: Comparator // TODO: this could be any comparator, not just string
) {
	if (typeof comparator === 'string') {
		return eb(field, '=', `${comparator}`);
	}

	const {
		eq,
		neq,
		in: _in,
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

	if (eq) {
		return eb(field, '=', eq);
	}

	if (neq) {
		return eb(field, '!=', neq);
	}

	if (_in) {
		return eb(field, 'in', _in);
	}

	if (nin) {
		return eb(field, 'not in', nin);
	}

	if ('contains' in rest) {
		// Then we have a string comparator
		const { contains, ncontains, startsWith, nstartsWith } = rest;

		if (contains) {
			return eb(field, 'like', `%${contains}%`);
		}

		if (ncontains) {
			return eb(field, 'not like', `%${ncontains}%`);
		}

		if (startsWith) {
			return eb(field, 'like', `${startsWith}%`);
		}

		if (nstartsWith) {
			return eb(field, 'not like', `${nstartsWith}%`);
		}
	}

	if ('gte' in rest) {
		const { gte, gt, lte, lt } = rest;

		if (gte) {
			return eb(field, '>=', gte);
		}

		if (gt) {
			return eb(field, '>', gt);
		}

		if (lte) {
			return eb(field, '<=', lte);
		}

		if (lt) {
			return eb(field, '<', lt);
		}
	}

	throw new Error('Unreachable');
}
