import { Resend } from 'resend';
import dotenv from 'dotenv';

// For development
dotenv.config({
	path: '../../.env',
});

export const resend = new Resend(process.env.RESEND_API_KEY as string);
