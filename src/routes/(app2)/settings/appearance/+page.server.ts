import { superValidate } from 'sveltekit-superforms/server';
import { appearanceFormSchema } from './form';
import { isTheme } from '$lib/features/settings/themes';

export const load = ({ cookies }) => {
	const cookiesTheme = cookies.get('theme') ?? '';
	const theme = isTheme(cookiesTheme) ? cookiesTheme : 'system';
	return {
		appearanceForm: superValidate(
			{
				theme,
			},
			appearanceFormSchema,
		),
		title: 'Appearance',
		theme,
	};
};
