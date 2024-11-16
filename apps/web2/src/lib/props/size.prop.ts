type Range<Start extends number, End extends number> =
	| Exclude<Enumerate<End>, Enumerate<Start>>
	| End;
type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
	? Acc[number]
	: Enumerate<N, [...Acc, Acc['length']]>;

function createSizes<const N extends number>(max: N): Record<Range<1, N>, string>;
function createSizes<const Min extends number, const Max extends number>(
	min: Min,
	max: Max
): Record<Range<Min, Max>, string>;
function createSizes(minOrMax: number, max?: number): Record<number, string> {
	const result: Record<number, string> = {};
	const start = max === undefined ? 1 : minOrMax;
	const end = max === undefined ? minOrMax : max;

	for (let i = start; i <= end; i++) {
		result[i] = `rt-r-size-${i}`;
	}

	return result;
}

export { createSizes };
