// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

// import type { Account_Data } from "$lib/USER/models";
// import type { Custom_Error } from "$lib/SHARED/models";
// import type { Database } from "$lib/supabase-types";
import type { SupabaseClient, Session, User } from "@supabase/supabase-js";

declare global {
    namespace App {
        // interface Error {
        // 	code?: string,
        // 	details?: string,
        // 	hint?: string,
        // 	note?: string,
        // 	status?: number,
        // 	client_message: string,
        // }
        interface Locals {
            sb: SupabaseClient
            getSession: () => Promise<Session | null>
            safeGetSession: () => Promise<{ session: Session | null; user: User | null }>
            session: Session | null
            user: User | null
            // account_data: Account_Schema | null
            // database_error: Custom_Error | null
        }
        interface PageData {
            session: Session | null
        }
        // interface PageState {}
        // interface Platform {}
    }
}

export { };
