import { RESEND_API_KEY } from '$env/static/private';
import { Resend } from 'resend';

export const resend = new Resend(RESEND_API_KEY);
