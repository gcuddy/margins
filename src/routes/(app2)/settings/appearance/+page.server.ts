import { superValidate } from 'sveltekit-superforms/server';
import { appearanceFormSchema } from './form';
import { isTheme } from '$lib/features/settings/themes';
import { loginRedirect } from '$lib/utils/redirects';

export const load = async (event) => {
	const { cookies, parent } = event;
	const cookiesTheme = cookies.get('theme') ?? '';
	const theme = isTheme(cookiesTheme) ? cookiesTheme : 'system';

	const { user } = await parent();
	if (!user) {
		throw loginRedirect(event);
	}
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
