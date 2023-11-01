import type { Command } from '$lib/types/command';
import { ClipboardCopy } from 'radix-icons-svelte';
import { toast } from 'svelte-sonner';

//copy name
// copy external url
// copy external url as markdown
// copy deeplink
export function createCopyCommands({
	name,
	_name,
	deeplink,
	externalUrl,
}: {
	name: string;
	_name?: string;
	deeplink?: string;
	externalUrl: string;
}): Array<Command> {
	return [
		{
			text: `Copy ${_name ?? 'name'}`,
			icon: ClipboardCopy,
			action: () => {
				navigator.clipboard.writeText(name);
				toast.success(`Copied ${_name ?? 'name'} to clipboard`);
			},
		},
		deeplink
			? {
					text: `Copy deeplink`,
					icon: ClipboardCopy,
					action: () => {
						navigator.clipboard.writeText(deeplink);
						toast.success(`Copied deeplink to clipboard`);
					},
			  }
			: undefined,
		{
			text: `Copy external URL`,
			icon: ClipboardCopy,
			action: () => {
				navigator.clipboard.writeText(externalUrl);
				toast.success(`Copied external URL to clipboard`);
			},
		},
		{
			text: `Copy external URL as Markdown`,
			icon: ClipboardCopy,
			action: () => {
				navigator.clipboard.writeText(`[${name}](${externalUrl})`);
				toast.success(`Copied markdown to clipboard`);
			},
		},
	].filter(Boolean);
}
