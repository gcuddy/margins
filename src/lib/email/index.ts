import { RESEND_API_KEY } from '$env/static/private';
import { Resend } from 'resend';

export const resend = new Resend(RESEND_API_KEY);

// resends.emails.send({

// })

// resend.emails.send({
//   from: 'onboarding@resend.dev',
//   to: 'gus.cuddy@gmail.com',
//   subject: 'Hello World',
//   html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
// });

export const sendEmail = async (
	body: Parameters<Resend['emails']['send']>[0],
) => {
	const res = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${RESEND_API_KEY}`,
		},
		body: JSON.stringify(body),
	});

	if (res.ok) {
		const data = await res.json();
		return data;
	}
};

