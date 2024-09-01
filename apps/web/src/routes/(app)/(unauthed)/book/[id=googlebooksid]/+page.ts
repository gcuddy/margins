export async function load({ params, fetch }) {
  const id = params.id.replace(/^gb_/i, "")
  //   TODO: fetch book here
  return {
    id,
  }
}
