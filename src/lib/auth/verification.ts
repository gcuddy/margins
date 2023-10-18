import { RESEND_API_KEY } from '$env/static/private';
import { resend, sendEmail } from '$lib/email';

export const sendEmailVerificationLink = async (
	email: string,
	token: string,
    _url: URL
) => {
	// TODO: replace this with real link
	const url = `${_url.origin}/email-verification/${token}`;
	await resend.emails.send({
		from: 'Margins <onboarding@info.margins.gg>',
		to: email,
		subject: 'Verify your email',
		html: `<p>Click <a href="${url}">here</a> to verify your email for Margins.</p>`,
	});
};

export const sendPasswordResetLink = async (email: string, token: string, _url: URL) => {
	const url = `${_url.origin}/password-reset/${token}`;
	// await resend.emails.send(
	// 	{
	// 		from: 'Margins <onboarding@info.margins.gg>',
	// 		to: email,
	// 		subject: 'Reset your password',
	// 		html: `<p>Click <a href="${url}">here</a> to reset your password for Margins.</p>
	//     <p>If you did not request a password reset, please ignore this email.</p>
	//     `,
	// 	},
	// 	{},
	// );

	return await sendEmail({
		from: 'Margins <onboarding@info.margins.gg>',
		to: email,
		subject: 'Reset your password',
		html: `<p>Click <a href="${url}">here</a> to reset your password for Margins.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        `,
	});
};
