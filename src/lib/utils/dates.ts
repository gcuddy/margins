import dayjs from 'dayjs';
// import weekday from 'dayjs/plugin/weekday';
// import localized from 'dayjs/plugin/localizedFormat';
// dayjs.extend(weekday);
// dayjs.extend(localized);
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

// param type matches dayjs()
export const formatDate = (date: string | number | Date | dayjs.Dayjs) => {
	const d = dayjs(date);
	// if today or yesterday, print 'today' or 'yesterday'
	// if less than a week ago, show the day of the week
	// if this year, format without year
	// else format full date with year
	if (dayjs().isSame(d, 'day')) {
		return 'today';
	} else if (dayjs().subtract(1, 'day').isSame(d, 'day')) {
		return 'yesterday';
	} else if (dayjs().diff(d, 'day') < 7) {
		return d.format('dddd');
	} else if (dayjs().isSame(d, 'year')) {
		return d.format('MMMM D');
	} else {
		return d.format('MMMM D, YYYY');
	}
};

export const formatDuration = (duration: number, unit: duration.DurationUnitType) => {
	const d = dayjs.duration(duration, unit);
	if (d.asHours() > 1) {
		return d.format('H[h] m[m]');
	} else {
		return d.format('m [min]');
	}
};

export const formatTimeDuration = (duration: number, unit: duration.DurationUnitType) => {
	const d = dayjs.duration(duration, unit);
	if (d.asHours() > 1) {
		return d.format('H:mm:ss');
	} else {
		return d.format('m:ss');
	}
};
