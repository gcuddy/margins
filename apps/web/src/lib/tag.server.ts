import type { Prisma } from '@prisma/client';

import { db } from '$lib/db';
export const connectOrCreateTaggings = ({
	tags,
	userId,
}: {
	tags:
		| {
				name: string;
				id?: number;
		  }[];
	userId?: string;
}) => {
	if (!userId) return;
	// Todo: determine without X based on generic
	// Todo: prisma.validator?
	const connectOrCreate: Prisma.Enumerable<Prisma.TaggingCreateOrConnectWithoutBookmarkInput> =
		tags.map((tag) => {
			const s = typeof tag === 'string';
			return {
				where: {
					// -1 so that it doesn't throw errors for undefined (no id will ever be negative)
					id: !s ? tag.id || -1 : -1,
				},
				create: {
					user: {
						connect: {
							id: userId,
						},
					},
					tag:
						!s && tag.id
							? {
									connectOrCreate: {
										where: {
											id: !s ? tag.id : -1,
											name_userId: {
												name: s ? tag : tag.name,
												userId,
											},
										},
										create: {
											name: s ? tag : tag.name,
											user: {
												connect: {
													id: userId,
												},
											},
										},
									},
							  }
							: {
									create: {
										name: s ? tag : tag.name,
										user: {
											connect: {
												id: userId,
											},
										},
									},
							  },
				},
			};
		});
	return connectOrCreate;
};
export const setTaggings = async ({
	tags,
	userId,
	bookmarkId,
}: {
	tags:
		| (
				| string
				| {
						name: string;
						id?: number;
				  }
		  )[];
	userId: string;
	bookmarkId: number;
	annotationId?: number;
	feedId?: number;
}) => {
	// todo: this is probably a slow way to do this
	const taggings: {
		name: string;
		id: number;
	}[] = [];
	const tagsToUpsert: typeof tags = [];
	tags.forEach((tag) => {
		const s = typeof tag === 'string';
		if (!s && 'id' in tag && tag.id) {
			taggings.push({
				name: tag.name,
				id: +tag.id,
			});
		} else {
			tagsToUpsert.push(tag);
		}
	});
	console.log({ existingTags: taggings, tagsToUpsert });
	const t = await db.$transaction(
		tagsToUpsert.map((tag) => {
			const s = typeof tag === 'string';
			const name = s ? tag : tag.name;
			return db.tag.upsert({
				where: {
					name_userId: {
						name,
						userId,
					},
				},
				create: {
					name,
					userId,
				},
				update: {},
			});
		})
	);
	const set: Prisma.Enumerable<Prisma.TaggingWhereUniqueInput> = taggings.concat(t).map((tag) => {
		return {
			bookmarkId_userId_tagId: {
				tagId: tag.id,
				bookmarkId,
				userId,
			},
		};
	});
	return set;
};
