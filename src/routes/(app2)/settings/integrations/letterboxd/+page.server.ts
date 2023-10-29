// TODO node?
import { fail } from '@sveltejs/kit';
import { XMLParser } from 'fast-xml-parser';
import { decode } from 'html-entities';
import { parse } from 'node-html-parser';
import { z } from 'zod';

import type { Actions } from './$types';
import { importMovies } from '$lib/db/queries/integration';
import { loginRedirect } from '$lib/utils/redirects';

export const load = async (event) => {
	const session = await event.locals.auth.validate();
	if (!session) throw loginRedirect(event);
	return {
		title: 'Letterboxd',
	};
};

const xmlParser = new XMLParser({
	attributeNamePrefix: '',
	ignoreAttributes: false,
});

export type LetterboxdItem = {
	description: string;
	image: ReturnType<typeof getImage>;
	link: string;
	rating: number;
	title: string;
	watchedDate: Date | null;
	year: number;
};

function getImage(description: string) {
	// find the film poster and grab it's src
	const doc = parse(description);
	const image = doc.querySelector('p img')?.getAttribute('src');

	if (!image) {
		return null;
	}

	const originalImageCropRegex = /-0-.*-crop/;
	return {
		large: image.replace(originalImageCropRegex, '-0-230-0-345-crop'),
		medium: image.replace(originalImageCropRegex, '-0-150-0-225-crop'),
		small: image.replace(originalImageCropRegex, '-0-70-0-105-crop'),
		tiny: image.replace(originalImageCropRegex, '-0-35-0-50-crop'),
	};
}

const strings = z.string().array();

export const actions: Actions = {
	importFeed: async ({ request }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		if (!username || typeof username !== 'string') {
			return fail(400, {
				message: 'No username provided',
			});
		}

		const response = await fetch(`https://letterboxd.com/${username}/rss/`);
		const xml = await response.text();
		const json = xmlParser.parse(xml);
		let films = json.rss.channel.item;
		// filter out non-films
		films = films.filter(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(film: { [x: string]: any }) => film['letterboxd:filmTitle'],
		);

		const mappedFilms: Array<LetterboxdItem> = films.map(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(film: { [x: string]: any; description: any; link: any }) => ({
				description: decode(film.description),
				image: getImage(film.description),
				link: film.link,
				rating: film['letterboxd:memberRating'],
				title: decode(film['letterboxd:filmTitle']),
				watchedDate: film['letterboxd:watchedDate']
					? new Date(film['letterboxd:watchedDate'])
					: null,
				year: film['letterboxd:filmYear'],
			}),
		);
		return {
			films: mappedFilms,
		};
	},
	async saveMovies(event) {
		const { request, locals } = event;
		// TODO: find movies in tmdb by title and year, see if we can save them
		const session = await locals.auth.validate();
		if (!session) {
			return fail(401, {
				message: 'Unauthorized',
			});
		}

		const formData = await request.formData();

		const ids = strings.safeParse(formData.getAll('id'));
		if (!ids.success) {
			return fail(400, {
				message: 'Invalid ids',
			});
		}

		// map ids to title, year. The year is divided off by a final "-"
		const movies = ids.data
			.map((id) => {
				const [title, year] = id.split('-');
				if (!title || !year) {
					return null;
				}
				return {
					title,
					year: +year,
				};
			})
			.filter(Boolean);

		await importMovies({
			ctx: {
				event,
				userId: session.user.userId,
			},
			input: {
				movies,
				status: 'Backlog',
			},
		});
	},
};
