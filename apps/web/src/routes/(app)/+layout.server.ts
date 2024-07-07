// TODO: make this work without server
export async function load({ locals, params }) {
  console.log("username load")
  if (!locals.user || !locals.session) {
    return {
      session: null,
      user: null,
    }
  }

  return {
    session: locals.session,
    user: locals.user as typeof locals.user & { username: string },
  }
}
