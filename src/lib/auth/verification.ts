import { resend } from '$lib/email';

export const sendEmailVerificationLink = async (
	email: string,
	token: string,
) => {
	// TODO: replace this with real link
	const url = `http://localhost:5173/email-verification/${token}`;
	await resend.emails.send({
		from: 'Margins <onboarding@info.margins.gg>',
		to: email,
		subject: 'Verify your email',
		html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
	});
};
