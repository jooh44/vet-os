import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            // DEV MODE: Authentication temporarily disabled for easier development
            return true;

            /* ORIGINAL PROTECTION LOGIC - TODO: Re-enable for Production
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
            if (isOnDashboard) {
              if (isLoggedIn) return true
              return false // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
              // Redirect logged-in users to dashboard if they are on login page
              if (nextUrl.pathname === '/login') {
                   return Response.redirect(new URL('/dashboard', nextUrl))
              }
             
            }
            return true
            */
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig
