export async function load({ fetch }) {
    // load dummy data
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts`)
    const posts = await response.json()
    return {
        posts: posts as { id: number, title: string, body: string }[]
    }
}