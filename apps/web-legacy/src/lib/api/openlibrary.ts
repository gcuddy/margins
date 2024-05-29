export const books = {
	get: async (isbn: string) => {
		const response = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);
		if (!response.ok) throw new Error(response.statusText);
		const data = await response.json();
		return data;
	},
};
