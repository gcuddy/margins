import type { Replace } from 'type-fest';

/**
 * Like String.replace, but fully typed.
 */
export function replace<
	S extends string,
	Match extends string,
	Replacement extends string,
>(str: S, match: Match, replacement: Replacement) {
	return str.replace(match, replacement) as Replace<S, Match, Replacement>;
}
