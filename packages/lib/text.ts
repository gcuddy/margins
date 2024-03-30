export function capitalize(s: string, normalize = false): string {
	if (normalize) {
		s = s.toLowerCase();
	}
	return s.charAt(0).toUpperCase() + s.slice(1);
}
