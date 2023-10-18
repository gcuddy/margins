import { uploadFile } from '$lib/backend/s3.server';
import { S3_BUCKET_PREFIX } from '$lib/constants';
import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/db';
export async function load({ locals }) {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');

	const invites = await db
		.selectFrom('InvitationCode')
		.where('ownerId', '=', session.user.userId)
		.where('used', '=', 0)
		.selectAll()
		.execute();

	return {
		user: session.user,
		title: 'Profile',
		description: 'Manage your profile, settings, and invites.',
		invites,
	};
}

export const actions = {
	default: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		if (!session) {
			return fail(401);
		}

		const data = await request.formData();

		const avatar = data.get('avatar') as File | undefined;
		const username = data.get('username') as string | undefined;

		if (avatar) {
			const arrayBuffer = await avatar.arrayBuffer();
			await uploadFile({
				Body: Buffer.from(arrayBuffer),
				Key: `user/${session.user.userId}/avatar.png`,
			});

			await auth.updateUserAttributes(session.user.userId, {
				avatar: `${S3_BUCKET_PREFIX}user/${session.user.userId}/avatar.png`,
			});

			return {
				message: 'ok',
				avatar: `${S3_BUCKET_PREFIX}user/${session.user.userId}/avatar.png`,
			};
		}

		console.log({ avatar, username });
	},
};
