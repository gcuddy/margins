import { customAlphabet } from 'nanoid';
const alphabet =
	'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export const nanoid = customAlphabet(alphabet, 12);

// alias for nanoid
export function generatePublicId() {
	return nanoid();
}

export const extendedNanoid = customAlphabet(
	'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_',
	24,
);

const shortNanoId = customAlphabet(alphabet, 8);
export function generateInviteCode() {
	return shortNanoId();
}
