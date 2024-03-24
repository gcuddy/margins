import { resend } from '$lib/email';

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
		to: email,
		subject: 'Verify your email',
		html: `<p>Your email verfication token is: <code>${token}</code>. Click <a href="">here</a> to verify your email.</p>`,
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
		to: email,
		subject: 'Reset your password',
		html: `<p>Click <a href="${url}">here</a> to reset your password for Margins.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        `,
	});
};
