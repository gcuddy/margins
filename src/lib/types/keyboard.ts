// TODO: This must already exist somewhere, right? 🤔
// Ref: https://www.w3.org/TR/uievents-key/#named-key-attribute-values
export enum Keys {
	Space = ' ',
	Enter = 'Enter',
	Escape = 'Escape',
	Backspace = 'Backspace',
	Delete = 'Delete',

	ArrowLeft = 'ArrowLeft',
	ArrowUp = 'ArrowUp',
	ArrowRight = 'ArrowRight',
	ArrowDown = 'ArrowDown',

	Home = 'Home',
	End = 'End',

	PageUp = 'PageUp',
	PageDown = 'PageDown',

	Tab = 'Tab'
}

export type Modifier = 'alt' | 'ctrl' | 'cmd' | 'shift';
export type Leader = 'g' | 'o';
type ApplicableShortcutKeys =
	| 'a'
	| 'b'
	| 'c'
	| 'd'
	| 'e'
	| 'f'
	| 'g'
	| 'h'
	| 'i'
	| 'j'
	| 'k'
	| 'l'
	| 'm'
	| 'n'
	| 'o'
	| 'p'
	| 'q'
	| 'r'
	| 's'
	| 't'
	| 'u'
	| 'v'
	| 'w'
	| 'x'
	| 'y'
	| 'z'
	| '0'
	| '1'
	| '2'
	| '3'
	| '4'
	| '5'
	| '6'
	| '7'
	| '8'
	| '9'
	| '-'
	| '='
	| 'Backspace'
	| 'Delete'
	| 'Enter'
	| 'Escape'
	| 'Home'
	| 'End'
	| 'PageUp'
	| 'PageDown'
	| 'ArrowLeft'
	| 'ArrowUp'
	| 'ArrowRight'
	| 'ArrowDown'
	| 'Tab'
	| 'Space';

export type ShortcutKey = ApplicableShortcutKeys | Modifier | Leader;

export const modifiers: Modifier[] = ['ctrl', 'shift', 'alt', 'cmd'];
export const leaders = ['g', 'o'];

export const specialKeys = [
	'Backspace',
	'Delete',
	'Enter',
	'Escape',
	'Home',
	'End',
	'PageUp',
	'PageDown',
	'ArrowLeft',
	'ArrowUp',
	'ArrowRight',
	'ArrowDown',
	'Tab',
	'Space'
];
export type SpecialKey = typeof specialKeys[number];

export const specialKeysUnicodeLookup: Record<SpecialKey, string> = {
	Backspace: '⌫',
	Delete: '⌦',
	Enter: '⏎',
	Escape: '⎋',
	Home: '⇱',
	End: '⇲',
	PageUp: '⇞',
	PageDown: '⇟',
	ArrowLeft: '←',
	ArrowUp: '↑',
	ArrowRight: '→',
	ArrowDown: '↓',
	Tab: '⇥',
	Space: '␣'
};
