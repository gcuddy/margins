import { RESEND_API_KEY } from '$env/static/private';
import { Resend } from 'resend';

export const resend = new Resend(RESEND_API_KEY);

// resend.emails.send({
//   from: 'onboarding@resend.dev',
//   to: 'gus.cuddy@gmail.com',
//   subject: 'Hello World',
//   html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
// });
