export function formatDate(input: string | number | Date): string {
    const date = new Date(input)
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    })
}

export const isUpcoming = (date: Date) => {
    const now = new Date()
    return date > now
}

export const getYear = (date: string | number | Date) => {
    return new Date(date).getFullYear()
}
