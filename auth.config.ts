import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnInvite = nextUrl.pathname.startsWith('/invite');
      const role = (auth?.user as any)?.role; // Retrieve role

      if (isOnDashboard) {
        if (isLoggedIn) {
          // RBAC: Redirect Tutors
          if (role === 'TUTOR') {
            // 1. Root Dashboard -> Tutor Home
            if (nextUrl.pathname === '/dashboard') {
              return Response.redirect(new URL('/dashboard/tutor-home', nextUrl));
            }

            // 2. Restricted Routes (Vet Only)
            const restrictedPaths = ['/dashboard/patients', '/dashboard/tutors', '/dashboard/records', '/dashboard/consultation'];
            if (restrictedPaths.some(path => nextUrl.pathname.startsWith(path))) {
              return Response.redirect(new URL('/dashboard/tutor-home', nextUrl));
            }
          }
          return true;
        }
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        // Redirect logged-in users to dashboard if they are on login page or invite page
        // Note: Invite page is for setting password. If already logged in, maybe just go to dashboard.
        if (nextUrl.pathname === '/login' || nextUrl.pathname.startsWith('/invite')) {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
      }

      // Allow access to Invite page if not logged in (it's public for activation)
      if (isOnInvite) return true;

      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig
