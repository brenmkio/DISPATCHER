import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async (event) => {
	event.depends('supabase:auth')

	const { session, user } = await event.locals.safeGetSession()

	const user_agent = event.request.headers.get('user-agent') ?? ''
	const isMobile = /Mobi|Android/i.test(user_agent)

	const path = event.url.pathname

	return {
		session,
		user,
		cookies: event.cookies.getAll(),
		isMobile,
		path
	}
}