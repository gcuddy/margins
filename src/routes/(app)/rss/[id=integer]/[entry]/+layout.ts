import type { LayoutLoad } from './$types';
export const load: LayoutLoad = async ({ params, parent, fetch }) => {
	const entry = params.entry;
	const data = await parent();
	console.log({ data });
	const item = data.items.find((item) => item.uuid === entry);
	console.log({ item });
	// mark as read
	fetch(`/rss/${params.id}/${params.entry}/mark_as_read`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${data.lucia?.access_token}`,
		},
	}).then((res) => console.log(res.ok));
	if (item) {
		item.is_read = true;
	}
	// if (res.ok && item) {
	// 	// hm. so is_read is a sort of "projection" of the interactions table?
	// }
	return {
		item,
	};
};
