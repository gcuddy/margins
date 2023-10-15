import { View } from '../../../../../../../routes/(app2)/views/new/View';
import { json } from '@sveltejs/kit';
import { parse } from 'devalue';

export async function GET({ params, request }) {
	const { view_id } = params;
	const data = await request.text();
	const { conditions, userId, cursor } = parse(data);
	const entries = await View.preview(conditions, userId, cursor);
	return json(entries);
}
