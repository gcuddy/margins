// token.ts
import { generateRandomString, isWithinExpiration } from 'lucia/utils';
import { db } from '$lib/db';

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

export const generateEmailVerificationToken = async (userId: string) => {
	const storedUserTokens = await db
		.selectFrom('EmailVerificationToken')
		.where('user_id', '=', userId)
		.selectAll()
		.execute();
	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((token) => {
			// check if expiration is within 1 hour
			// and reuse the token if true
			return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
		});
		if (reusableStoredToken) return reusableStoredToken.id;
	}
	const token = generateRandomString(63);
	await db
		.insertInto('EmailVerificationToken')
		.values({
			id: token,
			expires: new Date().getTime() + EXPIRES_IN,
			user_id: userId,
		})
		.execute();

	return token;
};

export const validateEmailVerificationToken = async (token: string) => {
	const storedToken = await db.transaction().execute(async (trx) => {
		const storedToken = await trx
			.selectFrom('EmailVerificationToken')
			.where('id', '=', token)
			.selectAll()
			.executeTakeFirst();
		if (!storedToken) throw new Error('Invalid token');
		await trx
			.deleteFrom('EmailVerificationToken')
			.where('user_id', '=', storedToken.user_id)
			.execute();
		return storedToken;
	});
	const tokenExpires = Number(storedToken.expires); // bigint => number conversion
	if (!isWithinExpiration(tokenExpires)) {
		throw new Error('Expired token');
	}
	return storedToken.user_id;
};
