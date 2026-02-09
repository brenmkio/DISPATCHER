import { createServerClient } from '@supabase/ssr'
import { type Handle, redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'



const supabase: Handle = async ({ event, resolve }) => {
    /**
     * Creates a Supabase client specific to this server request.
     *
     * The Supabase client gets the Auth token from the request cookies.
     */
    event.locals.sb = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
            getAll: () => event.cookies.getAll(),
            /**
             * SvelteKit's cookies API requires `path` to be explicitly set in
             * the cookie options. Setting `path` to `/` replicates previous/
             * standard behavior.
             */
            setAll: (cookiesToSet) => {
                cookiesToSet.forEach(({ name, value, options }) => {
                    event.cookies.set(name, value, { ...options, path: '/' })
                })
            },
        },
    })

    /**
     * Unlike `supabase.auth.getSession()`, which returns the session _without_
     * validating the JWT, this function also calls `getUser()` to validate the
     * JWT before returning the session.
     */
    event.locals.safeGetSession = async () => {
        const {
            data: { session },
        } = await event.locals.sb.auth.getSession()
        if (!session) {
            return { session: null, user: null }
        }

        const {
            data: { user },
            error,
        } = await event.locals.sb.auth.getUser()
        if (error) {
            // JWT validation has failed
            return { session: null, user: null }
        }

        return { session, user }
    }

    const { session } = await event.locals.safeGetSession()

    if (session) {

        // get account
        const user = await event.locals.sb.auth.getUser()
        const user_id = user.data.user?.id

        if (user_id) {
            // event.locals.account_data = await DAL_get_account_by_id(event.locals.sb, user_id)
        }
    }

    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            /**
             * Supabase libraries use the `content-range` and `x-supabase-api-version`
             * headers, so we need to tell SvelteKit to pass it through.
             */
            return name === 'content-range' || name === 'x-supabase-api-version'
        },
    })
}

const authGuard: Handle = async ({ event, resolve }) => {
    const { session, user } = await event.locals.safeGetSession()
    event.locals.session = session
    event.locals.user = user

    if (!event.locals.session && event.url.pathname.startsWith('/private')) {
        redirect(303, '/auth')
    }

    // if (event.locals.session && event.url.pathname === '/auth') {
    //   redirect(303, '/private')
    // }

    return resolve(event)
}

const test_output: Handle = async ({ event, resolve }) => {
    // console.log('HOOK - method:', event.request.method, 'url:', event.url.pathname)
    return resolve(event)
}


export const handle: Handle = sequence(supabase, authGuard, test_output)