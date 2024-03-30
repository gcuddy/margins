import { resend } from '@margins/email';

import { db } from '@margins/db';
import { TimeSpan, createDate } from 'oslo';
import { generateRandomString, alphabet } from 'oslo/crypto';
import { VERIFICATION_CODE_LENGTH } from './constants.js';

// TODO: add rate limiting via upstash rate limit

export const generateEmailVerificationToken = async (
	userId: string,
	email: string,
): Promise<string> => {
	await db
		.deleteFrom('EmailVerificationToken')
		.where('user_id', '=', userId)
		.execute();
	const code = generateRandomString(VERIFICATION_CODE_LENGTH, alphabet('0-9'));
	await db
		.insertInto('EmailVerificationToken')
		.values({
			code,
			email,
			expires: createDate(new TimeSpan(15, 'm')),
			user_id: userId, // 15 minutes
		})
		.execute();
	return code;
};

// TODO: react emails

export const sendEmailVerificationLink = async (
	email: string,
	token: string,
) => {
	if (!process.env.EMAIL_VERIFICATION) {
		console.warn(
			'EMAIL_VERIFICATION is not set, skipping email verification link',
		);
		return;
	}
	// TODO: add url based on env
	await resend.emails.send({
		from: 'Margins <onboarding@info.margins.gg>',
		html: `<p>Your email verfication token is: <code>${token}</code>. Click <a href="">here</a> to verify your email.</p>`,
		subject: 'Verify your email',
		to: email,
	});
};

export const sendPasswordResetLink = async (
	email: string,
	token: string,
	_url: URL,
) => {
	const url = `${_url.origin}/password-reset/${token}`;

	return await resend.emails.send({
		from: 'Margins <onboarding@info.margins.gg>',
		html: `<p>Click <a href="${url}">here</a> to reset your password for Margins.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        `,
		subject: 'Reset your password',
		to: email,
	});
};
