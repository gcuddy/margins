import { AnnotationType, Prisma } from "@prisma/client";

import { db } from "$lib/db";

// TODO: specify fields you need
export async function getUserData(id: string) {
	console.log(`getting user data`);
	const user = await db.user.findFirst({
		where: {
			id,
		},
		select: {
			username: true,
			email: true,
			id: true,
			following: true,
			stylesheets: true,
			states: true,
			default_state_id: true,
			annotations: {
				select: {
					id: true,
					entryId: true,
					_count: {
						select: {
							children: true,
						},
					},
					entry: {
						select: {
							id: true,
							interactions: {
								where: {
									userId: id,
								},
							},
						},
					},
				},
				where: {
					type: AnnotationType.bookmark,
					deleted: null,
				},
			},
			tags: {
				select: {
					name: true,
					id: true,
				},
			},
		},
	});
	if (!user) {
		throw Error("No user found");
	}
	return user;
}

export type RootUserData = Prisma.PromiseReturnType<typeof getUserData>;

export async function createDefaultStates(userId: string) {
	const states: Prisma.StateCreateManyInput[] = [
		{
			name: "Inbox",
			type: "inbox",
			position: 0,
			userId,
		},
		{
			name: "Next",
			type: "soon",
			position: 0,
			userId,
		},
		{
			name: "Later",
			type: "later",
			position: 0,
			userId,
		},
		{
			name: "Archive",
			type: "archive",
			position: 0,
			userId,
		},
	];
	const records = await db.$transaction(
		states.map((state) =>
			db.state.create({
				data: state,
			})
		)
	);
	const default_id = records.find((r) => r.name === "Inbox")?.id;
	await db.user.update({
		where: {
			id: userId,
		},
		data: {
			default_state_id: default_id,
		},
	});
	// return await db.state.createMany({
	// 	data: states,
	// });
}
