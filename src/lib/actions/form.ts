import { goto as go, invalidate as inv } from '$app/navigation';
export type Error = ({
	data,
	form,
	response,
	error,
}: {
	data: FormData;
	form: HTMLFormElement;
	response: Response | null;
	error: Error | null;
}) => void;
export type Pending = ({ data, form }: { data: FormData; form: HTMLFormElement }) => void;
export type Result = ({
	data,
	form,
	response,
}: {
	data: FormData;
	response: Response;
	form: HTMLFormElement;
}) => void;

// this action (https://svelte.dev/tutorial/actions) allows us to
// progressively enhance a <form> that already works without JS
export function enhance(
	form: HTMLFormElement,
	{
		pending,
		error,
		result,
		invalidate,
		goto,
		headers,
	}: {
		pending?: Pending;
		error?: Error;
		result?: Result;
		invalidate?: Parameters<typeof inv>[0];
		goto?: boolean;
		headers?: Headers;
	} = {}
): { destroy: () => void } {
	let current_token: unknown;

	async function handle_submit(e: Event) {
		const token = (current_token = {});

		const data = new FormData(form);

		if (pending) pending({ data, form });

		try {
			if (headers) {
				headers = new Headers();
				headers?.set('accept', 'application/json');
			}
			const options: RequestInit = {
				method: form.method,
				headers,
			};
			const url = new URL(form.action);

			// coercing to any is necessary for the FormData
			// this won't work if there's files in the formData, so I should come up with a better solution
			// see https://github.com/microsoft/TypeScript/issues/30584
			// the reason we do this is because if we just put formdata in the body it changes the contenttype
			// see https://austingil.com/resilient-applications-progressive-enhancement/
			const searchParams = new URLSearchParams(data as any);
			if (options.method === 'post') {
				// Modify request body to include form data
				options.body = form.enctype === 'multipart/form-data' ? data : searchParams;
			} else {
				// Modify URL to include form data
				url.search = searchParams.toString();
			}

			if (goto) {
				console.log(`going to ${url.search}`);
				go(url.search);
			}

			const response = await fetch(url.toString(), options);
			e.preventDefault();
			// const response = await fetch(form.action, {
			// 	method: form.method,
			// 	headers: {
			// 		accept: 'application/json'
			// 	},
			// 	body: data
			// });

			if (token !== current_token) return;

			if (response.ok) {
				// todo: should invalidate be a default result, or an additional prop?
				if (invalidate) inv(invalidate);
				if (result) result({ data, form, response });

				const url = new URL(form.action);
				url.search = url.hash = '';
				inv(url.href);
			} else if (error) {
				error({ data, form, error: null, response });
			} else {
				console.error(await response.text());
			}
		} catch (e: any) {
			if (error) {
				error({ data, form, error: e, response: null });
			} else {
				throw e;
			}
		}
	}

	form.addEventListener('submit', handle_submit);

	return {
		destroy() {
			form.removeEventListener('submit', handle_submit);
		},
	};
}
