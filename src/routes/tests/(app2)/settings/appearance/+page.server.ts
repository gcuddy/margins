export const load = ({ cookies }) => {
    return {
        title: "Appearance",
        theme: cookies.get('theme')
    }
}