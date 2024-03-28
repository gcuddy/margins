/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/// <reference types="@sveltejs/kit" />

declare global {
	namespace App {
		namespace Superforms {
			type Message = import('$lib/types/forms').Message;
		}

		interface Locals {
			session: import('lucia').Session | null;
			user: import('lucia').User | null;
		}
		interface PageData {
			description?: string;
			title?: string;
		}
	}
}

export {};
