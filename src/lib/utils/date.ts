import { readable } from 'svelte/store';
import type { ConditionalPick } from 'type-fest';

export function normalizeTimezone(isoString: string | Date) {
	if (typeof isoString === 'string') {
		return isoString.replace(/00$/, 'Z');
	}
	return isoString.toISOString().replace(/00$/, 'Z');
}

export function formatDate(
	input: string | number | Date,
	opts: Intl.DateTimeFormatOptions & {
		/** If set to true, will not print the year if it's within this calendar year. Defaults to true. */
		preferShortest?: boolean;
	} = {
		day: 'numeric',
		month: 'short',
		preferShortest: true,
		year: '2-digit',
	},
): string {
	const date = new Date(input);
	const { preferShortest, ...options } = opts;

	if (preferShortest) {
		// if Today, just return the time
		const now = new Date();

		if (
			date.getDate() === now.getDate() &&
			date.getMonth() === now.getMonth() &&
			date.getFullYear() === now.getFullYear()
		) {
			return date.toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: 'numeric',
			});
		}

		if (date.getFullYear() === now.getFullYear()) {
			delete options.year;
		}
	}

	return date.toLocaleDateString('en-US', options);
}

export const isUpcoming = (date: Date) => {
	const now = new Date();
	return date > now;
};

export const getYear = (date: string | number | Date) => {
	return new Date(date).getFullYear();
};

export function ago(a: Date, b: Date) {
	const ms = b.getTime() - a.getTime();
	if (ms < 10 * 1000) {
		return 'a few seconds ago';
	}
	if (ms < 60 * 1000) {
		return 'less than a minute ago';
	}

	const minutes = Math.floor(ms / (60 * 1000));

	if (minutes === 1) {
		return 'a minute ago';
	}
	if (minutes < 60) {
		return `${minutes} minutes ago`;
	}

	const hours = Math.floor(ms / (60 * 60 * 1000));

	if (hours === 1) {
		return 'an hour ago';
	}
	if (hours < 24) {
		return `${hours} hours ago`;
	}

	const a_day = new Date(a.getFullYear(), a.getMonth(), a.getDate());
	const b_day = new Date(b.getFullYear(), b.getMonth(), b.getDate());

	const days = Math.round(
		(b_day.getTime() - a_day.getTime()) / (24 * 60 * 60 * 1000),
	);

	if (days === 1) {
		return 'yesterday';
	}
	if (days < 7) {
		return `${days} days ago`;
	}
	if (days === 7) {
		return 'a week ago';
	}

	if (days < 28) {
		return `${Math.ceil(days / 7)} weeks ago`;
	}
	if (days < 335) {
		return `${Math.ceil(days / (365 / 12))} months ago`;
	}

	const years = Math.round(days / 365);
	return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}

export const now = readable(new Date(), (set) => {
	const interval = setInterval(() => {
		set(new Date());
	}, 1000);

	return () => {
		clearInterval(interval);
	};
});

/**
 *
 * @param duration @type{number}
 * @param unit @type{"m" | "s" | "ms"}
 */
export const formatDuration = (
	duration: number,
	unit?: 'm' | 's' | 'ms',
	showSeconds = false,
) => {
	// convert to ms
	if (unit === 'm') {
		duration *= 60 * 1000;
	} else if (unit === 's') {
		duration *= 1000;
	}

	const hours = Math.floor(duration / (60 * 60 * 1000));
	const minutes = Math.floor(duration / (60 * 1000)) % 60;
	const seconds = Math.floor(duration / 1000) % 60;

	const parts = [];
	if (hours > 0) {
		parts.push(`${hours}h`);
	}
	if (minutes > 0) {
		parts.push(`${minutes}m`);
	}
	if (showSeconds && seconds > 0) {
		parts.push(`${seconds}s`);
	}
	return parts.join(' ');
};

type SortOrder = 'asc' | 'desc';

export function sortByDate<T>(
	arr: Array<T>,
	dateKey: keyof T extends string | number | Date ? keyof T : never,
	sortOrder: SortOrder = 'asc',
): Array<T> {
	const sortedArray = [...arr].sort((a, b) => {
		const dateA = new Date(a[dateKey] as any);
		const dateB = new Date(b[dateKey] as any);

		return sortOrder === 'asc'
			? dateA.getTime() - dateB.getTime()
			: dateB.getTime() - dateA.getTime();
	});

	return sortedArray;
}

